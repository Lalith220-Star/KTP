"""
Sample ingestion script for Localytics
This script demonstrates how to call Google Places and Yelp endpoints to fetch place details and reviews.
Fill GOOGLE_PLACES_API_KEY and YELP_API_KEY in the environment before running.

Note: This is a starter example — adapt to your rate limits, error handling, and storage preferences.
"""
import os
import requests
from typing import Optional

GOOGLE_KEY = os.getenv('GOOGLE_PLACES_API_KEY')
YELP_KEY = os.getenv('YELP_API_KEY')

def get_google_place_details(place_id: str) -> Optional[dict]:
    if not GOOGLE_KEY:
        print('Missing GOOGLE_PLACES_API_KEY')
        return None
    url = 'https://maps.googleapis.com/maps/api/place/details/json'
    params = {'place_id': place_id, 'key': GOOGLE_KEY}
    r = requests.get(url, params=params)
    r.raise_for_status()
    return r.json()

def get_yelp_business_reviews(business_id: str) -> Optional[dict]:
    if not YELP_KEY:
        print('Missing YELP_API_KEY')
        return None
    url = f'https://api.yelp.com/v3/businesses/{business_id}/reviews'
    headers = {'Authorization': f'Bearer {YELP_KEY}'}
    r = requests.get(url, headers=headers)
    r.raise_for_status()
    return r.json()

def main():
    # Example placeholders — replace with real place ids / yelp ids
    google_place_id = 'ChIJN1t_tDeuEmsRUsoyG83frY4'
    yelp_business_id = 'yelp-san-francisco'

    g = get_google_place_details(google_place_id)
    print('Google place result keys:', list(g.keys()) if g else None)

    y = get_yelp_business_reviews(yelp_business_id)
    print('Yelp reviews keys:', list(y.keys()) if y else None)

if __name__ == '__main__':
    main()
