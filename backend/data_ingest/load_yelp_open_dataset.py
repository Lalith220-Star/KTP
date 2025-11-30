#!/usr/bin/env python3
"""
Load Yelp Open Dataset JSON files into the Localytics Postgres schema.

Usage:
  export DATABASE_URL="postgres://user:pass@host:5432/dbname"
  python backend/data_ingest/load_yelp_open_dataset.py --data-dir /path/to/yelp_dataset --business-limit 1000 --review-limit 5000

The script expects the Yelp dataset files `business.json` and `review.json` (line-delimited JSON).
It will upsert businesses into `restaurants` (setting `external_id` to Yelp business id) and insert reviews into `raw_reviews`.

Be careful with large limits — run with small limits for initial testing.
"""
import argparse
import json
import os
import sys
from typing import Dict, List

import psycopg2
from psycopg2.extras import execute_values


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument('--data-dir', required=True, help='Directory containing business.json and review.json')
    p.add_argument('--business-limit', type=int, default=1000)
    p.add_argument('--review-limit', type=int, default=5000)
    p.add_argument('--database-url', default=os.getenv('DATABASE_URL') or os.getenv('SUPABASE_DB_URL'))
    return p.parse_args()


def connect(db_url: str):
    if not db_url:
        print('DATABASE_URL must be set via --database-url or env DATABASE_URL/SUPABASE_DB_URL')
        sys.exit(1)
    return psycopg2.connect(db_url)


def load_businesses(conn, business_file: str, limit: int) -> Dict[str, str]:
    """Reads Yelp business.json and upserts into restaurants.
    Returns mapping from yelp_business_id -> restaurants.id (uuid)
    """
    print('Loading businesses from', business_file)
    businesses = []
    with open(business_file, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f):
            if i >= limit:
                break
            obj = json.loads(line)
            # normalize categories to a primary cuisine if present
            cuisine = None
            if obj.get('categories'):
                # categories is a string like 'Restaurants, Italian'
                try:
                    cuisine = obj['categories'].split(',')[0].strip()
                except Exception:
                    cuisine = None

            address = ', '.join(filter(None, [obj.get('address1'), obj.get('address2'), obj.get('address3')]))

            businesses.append((
                obj.get('id'),
                obj.get('name'),
                address,
                obj.get('city'),
                obj.get('state'),
                obj.get('zip_code'),
                cuisine,
                obj.get('coordinates', {}).get('latitude'),
                obj.get('coordinates', {}).get('longitude')
            ))

    cur = conn.cursor()
    sql = """
    INSERT INTO restaurants (external_id, name, address, city, state, zip, cuisine, lat, lng)
    VALUES %s
    ON CONFLICT (external_id) DO UPDATE SET name = EXCLUDED.name, address = EXCLUDED.address, city = EXCLUDED.city, state = EXCLUDED.state, zip = EXCLUDED.zip, cuisine = EXCLUDED.cuisine, lat = EXCLUDED.lat, lng = EXCLUDED.lng
    RETURNING id, external_id
    """
    # execute_values for batch insert
    execute_values(cur, sql, businesses, template='(%s,%s,%s,%s,%s,%s,%s,%s,%s)')
    rows = cur.fetchall()
    conn.commit()

    mapping = {external_id: rid for (rid, external_id) in rows}
    print(f'Inserted/updated {len(rows)} restaurants')
    return mapping


def load_reviews(conn, review_file: str, mapping: Dict[str, str], limit: int):
    print('Loading reviews from', review_file)
    batch = []
    inserted = 0
    cur = conn.cursor()
    with open(review_file, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f):
            if i >= limit:
                break
            obj = json.loads(line)
            business_id = obj.get('business_id')
            if business_id not in mapping:
                continue
            restaurant_id = mapping[business_id]
            review_id = obj.get('review_id')
            author = obj.get('user', {}).get('name')
            rating = obj.get('stars')
            text = obj.get('text')
            created_at = obj.get('date')
            batch.append((restaurant_id, 'yelp', review_id, author, rating, text, created_at))

            if len(batch) >= 1000:
                execute_values(cur, "INSERT INTO raw_reviews (restaurant_id, source, source_review_id, author, rating, text, created_at) VALUES %s ON CONFLICT DO NOTHING", batch)
                conn.commit()
                inserted += len(batch)
                print(f'Inserted {inserted} reviews...')
                batch = []

    if batch:
        execute_values(cur, "INSERT INTO raw_reviews (restaurant_id, source, source_review_id, author, rating, text, created_at) VALUES %s ON CONFLICT DO NOTHING", batch)
        conn.commit()
        inserted += len(batch)

    print(f'Total inserted reviews: {inserted}')


def main():
    args = parse_args()
    conn = connect(args.database_url)

    business_file = os.path.join(args.data_dir, 'business.json')
    review_file = os.path.join(args.data_dir, 'review.json')

    if not os.path.exists(business_file):
        print('business.json not found in', args.data_dir)
        sys.exit(1)
    if not os.path.exists(review_file):
        print('review.json not found in', args.data_dir)
        sys.exit(1)

    mapping = load_businesses(conn, business_file, args.business_limit)
    # mapping keys are external_id values (yelp id), values are restaurants.id (uuid)
    # Note: mapping currently built from RETURNING; if DB returned only inserted rows, we might miss existing ones
    # To be safe, fetch full mapping for external_ids we processed
    cur = conn.cursor()
    cur.execute("SELECT id, external_id FROM restaurants WHERE external_id IS NOT NULL")
    rows = cur.fetchall()
    full_map = {external_id: rid for (rid, external_id) in rows}

    load_reviews(conn, review_file, full_map, args.review_limit)
    conn.close()


if __name__ == '__main__':
    main()
