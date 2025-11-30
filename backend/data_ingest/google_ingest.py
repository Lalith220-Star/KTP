#!/usr/bin/env python3
"""
Google Places ingestion script

This script searches Google Places for POIs (restaurants) and fetches Place Details to collect
metadata and reviews. It upserts restaurants into `restaurants` and inserts reviews into `raw_reviews`.

USAGE
  export GOOGLE_PLACES_API_KEY="<your-key>"
  export DATABASE_URL="postgres://user:pass@host:5432/dbname"
  python backend/data_ingest/google_ingest.py --query "restaurants in San Francisco" --limit 200

NOTES
- Do NOT commit your API key to the repository. Set it in your environment or a secrets manager.
- Places Text Search returns pages (up to 20 results per page) and may require a short delay before a next_page_token becomes valid.
- Place Details reviews are limited by the API (not a full archive). Use the Yelp dataset if you need extensive historical reviews.
"""
import argparse
import os
import sys
import time
import requests
import psycopg2
from psycopg2.extras import execute_values

PLACES_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json'
PLACES_DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json'


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument('--query', required=True, help='Search query (e.g. "restaurants in San Francisco")')
    p.add_argument('--limit', type=int, default=200, help='Maximum number of places to fetch')
    p.add_argument('--database-url', default=os.getenv('DATABASE_URL') or os.getenv('SUPABASE_DB_URL'))
    p.add_argument('--api-key', default=os.getenv('GOOGLE_PLACES_API_KEY'))
    p.add_argument('--sleep', type=float, default=0.3, help='Seconds to sleep between API calls')
    return p.parse_args()


def connect(db_url):
    if not db_url:
        print('DATABASE_URL must be set')
        sys.exit(1)
    return psycopg2.connect(db_url)


def places_search(api_key, query, next_page_token=None):
    params = {'query': query, 'key': api_key}
    if next_page_token:
        params['pagetoken'] = next_page_token
    r = requests.get(PLACES_SEARCH_URL, params=params)
    r.raise_for_status()
    return r.json()


def place_details(api_key, place_id):
    fields = 'place_id,name,rating,user_ratings_total,reviews,opening_hours,geometry,formatted_address'
    params = {'place_id': place_id, 'fields': fields, 'key': api_key}
    r = requests.get(PLACES_DETAILS_URL, params=params)
    r.raise_for_status()
    return r.json()


def upsert_place(conn, result):
    cur = conn.cursor()
    place_id = result.get('place_id')
    name = result.get('name')
    address = result.get('formatted_address')
    geometry = result.get('geometry', {})
    loc = geometry.get('location', {})
    lat = loc.get('lat')
    lng = loc.get('lng')
    # pick cuisine from name or leave null (could be improved)
    cuisine = None

    sql = """
    INSERT INTO restaurants (external_id, name, address, city, state, zip, cuisine, lat, lng)
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
    ON CONFLICT (external_id) DO UPDATE SET name = EXCLUDED.name, address = EXCLUDED.address, lat = EXCLUDED.lat, lng = EXCLUDED.lng
    RETURNING id
    """
    # Address parsing into city/state/zip is not handled here; store full address in `address`.
    cur.execute(sql, (place_id, name, address, None, None, None, cuisine, lat, lng))
    rid = cur.fetchone()[0]
    conn.commit()
    return rid


def insert_reviews(conn, restaurant_id, reviews):
    if not reviews:
        return
    cur = conn.cursor()
    rows = []
    for r in reviews:
        author = r.get('author_name')
        rating = r.get('rating')
        text = r.get('text')
        # Google returns time as seconds since epoch
        ts = None
        if r.get('time'):
            try:
                ts = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime(r.get('time')))
            except Exception:
                ts = None
        rows.append((restaurant_id, 'google', None, author, rating, text, ts))
    execute_values(cur, "INSERT INTO raw_reviews (restaurant_id, source, source_review_id, author, rating, text, created_at) VALUES %s ON CONFLICT DO NOTHING", rows)
    conn.commit()


def main():
    args = parse_args()
    if not args.api_key:
        print('GOOGLE_PLACES_API_KEY must be set via --api-key or env GOOGLE_PLACES_API_KEY')
        sys.exit(1)

    conn = connect(args.database_url)

    fetched = 0
    next_page = None
    # Google Text Search returns up to 20 results per page
    while fetched < args.limit:
        data = places_search(args.api_key, args.query, next_page)
        results = data.get('results', [])
        for res in results:
            if fetched >= args.limit:
                break
            place_id = res.get('place_id')
            # request place details
            try:
                details = place_details(args.api_key, place_id).get('result', {})
            except Exception as e:
                print('Error fetching details for', place_id, e)
                time.sleep(2)
                continue

            rid = upsert_place(conn, details)
            reviews = details.get('reviews') or []
            insert_reviews(conn, rid, reviews)
            fetched += 1
            time.sleep(args.sleep)

        # handle pagination via next_page_token
        next_page = data.get('next_page_token')
        if not next_page:
            break
        # next_page_token may require a short delay before it becomes valid
        time.sleep(2)

    conn.close()
    print(f'Done: fetched {fetched} places')


if __name__ == '__main__':
    main()
