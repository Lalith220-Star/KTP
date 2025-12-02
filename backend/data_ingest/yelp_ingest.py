#!/usr/bin/env python3
"""
Yelp Fusion ingestion script

This script uses the Yelp Fusion API to search for businesses (restaurants) and fetch reviews.
It upserts businesses into `restaurants` and inserts reviews into `raw_reviews`.

Usage:
  export YELP_API_KEY="..."
  export DATABASE_URL="postgres://user:pass@host:5432/dbname"
  python backend/data_ingest/yelp_ingest.py --location "San Francisco, CA" --term "restaurants" --limit 200

Notes:
- Yelp Fusion's /businesses/{id}/reviews returns up to 3 reviews per business. For more historical reviews, you need dataset access or other sources.
- Be mindful of rate limits; this script includes a basic sleep between requests and retries on 429.
"""
import argparse
import os
import sys
import time
import requests
import psycopg2
from psycopg2.extras import execute_values

YELP_API_BASE = 'https://api.yelp.com/v3'


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument('--location', required=True, help='Location string for Yelp search (e.g. "San Francisco, CA")')
    p.add_argument('--term', default='restaurants', help='Search term (default: restaurants)')
    p.add_argument('--limit', type=int, default=200, help='Number of businesses to fetch')
    p.add_argument('--database-url', default=os.getenv('DATABASE_URL') or os.getenv('SUPABASE_DB_URL'))
    p.add_argument('--api-key', default=os.getenv('YELP_API_KEY'))
    p.add_argument('--sleep', type=float, default=0.35, help='Seconds to sleep between API calls')
    return p.parse_args()


def connect(db_url):
    if not db_url:
        print('DATABASE_URL must be set')
        sys.exit(1)
    return psycopg2.connect(db_url)


def yelp_search(api_key, term, location, offset=0, limit=50):
    headers = {'Authorization': f'Bearer {api_key}'}
    params = {'term': term, 'location': location, 'limit': limit, 'offset': offset}
    url = f'{YELP_API_BASE}/businesses/search'
    r = requests.get(url, headers=headers, params=params)
    if r.status_code == 429:
        raise RuntimeError('Rate limited')
    r.raise_for_status()
    return r.json()


def get_business_reviews(api_key, business_id):
    headers = {'Authorization': f'Bearer {api_key}'}
    url = f'{YELP_API_BASE}/businesses/{business_id}/reviews'
    r = requests.get(url, headers=headers)
    if r.status_code == 429:
        raise RuntimeError('Rate limited')
    r.raise_for_status()
    return r.json()


def upsert_business(conn, biz):
    cur = conn.cursor()
    ext_id = biz.get('id')
    name = biz.get('name')
    loc = biz.get('location', {})
    address = ', '.join(filter(None, [loc.get('address1'), loc.get('address2'), loc.get('address3')]))
    city = loc.get('city')
    state = loc.get('state')
    zip_code = loc.get('zip_code')
    cuisine = None
    cats = biz.get('categories') or []
    if cats:
        try:
            cuisine = cats[0].get('title')
        except Exception:
            cuisine = None
    lat = biz.get('coordinates', {}).get('latitude')
    lng = biz.get('coordinates', {}).get('longitude')

    # Check if restaurant already exists
    cur.execute("SELECT id FROM restaurants WHERE external_id = %s", (ext_id,))
    existing = cur.fetchone()
    
    if existing:
        # Update existing restaurant
        rid = existing[0]
        cur.execute("""
            UPDATE restaurants 
            SET name = %s, address = %s, city = %s, state = %s, zip = %s, cuisine = %s, lat = %s, lng = %s
            WHERE id = %s
        """, (name, address, city, state, zip_code, cuisine, lat, lng, rid))
    else:
        # Insert new restaurant
        cur.execute("""
            INSERT INTO restaurants (external_id, name, address, city, state, zip, cuisine, lat, lng)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING id
        """, (ext_id, name, address, city, state, zip_code, cuisine, lat, lng))
        rid = cur.fetchone()[0]
    
    conn.commit()
    return rid


def insert_reviews(conn, restaurant_id, reviews):
    if not reviews:
        return
    cur = conn.cursor()
    rows = []
    for r in reviews:
        rid = r.get('id')
        author = r.get('user', {}).get('name')
        rating = r.get('rating')
        text = r.get('text')
        created_at = r.get('time_created')
        rows.append((restaurant_id, 'yelp', rid, author, rating, text, created_at))
    execute_values(cur, "INSERT INTO raw_reviews (restaurant_id, source, source_review_id, author, rating, text, created_at) VALUES %s ON CONFLICT DO NOTHING", rows)
    conn.commit()


def main():
    args = parse_args()
    if not args.api_key:
        print('YELP_API_KEY must be set via --api-key or env YELP_API_KEY')
        sys.exit(1)

    global conn
    conn = connect(args.database_url)

    fetched = 0
    offset = 0
    page_limit = 50
    while fetched < args.limit:
        try:
            batch = min(page_limit, args.limit - fetched)
            data = yelp_search(args.api_key, args.term, args.location, offset=offset, limit=batch)
        except RuntimeError as e:
            print('Rate limited, sleeping 10s...')
            time.sleep(10)
            continue
        businesses = data.get('businesses', [])
        if not businesses:
            break
        for biz in businesses:
            try:
                rid = upsert_business(conn, biz)
                # fetch up to 3 latest reviews
                try:
                    revs = get_business_reviews(args.api_key, biz.get('id')).get('reviews', [])
                except RuntimeError:
                    print('Rate limited fetching reviews, sleeping 10s...')
                    time.sleep(10)
                    revs = []
                insert_reviews(conn, rid, revs)
                time.sleep(args.sleep)
            except Exception as ex:
                print('Error processing business', biz.get('id'), ex)
                continue
        batch_count = len(businesses)
        fetched += batch_count
        offset += batch_count
        if batch_count < batch:
            break

    conn.close()
    print(f'Done: fetched {fetched} businesses')


if __name__ == '__main__':
    main()
