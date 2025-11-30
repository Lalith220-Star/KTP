Google Places API — how to get an API key

1) Create or select a Google Cloud project
- Go to https://console.cloud.google.com
- Create a new project (e.g., Localytics) or select an existing one.

2) Enable the Places API
- In the Console, go to "APIs & Services" > "Library".
- Search for "Places API" and click Enable.
- Optionally enable "Maps JavaScript API" and "Geocoding API" if you need maps/geocoding.

3) Enable billing
- Google requires billing for Places API usage. In "Billing", link a billing account. There is a free tier/credits but billing must be enabled.

4) Create API credentials
- Go to "APIs & Services" > "Credentials" > "Create credentials" > "API key".
- Name it (e.g., localytics-places-key).

5) Restrict the key (recommended)
- Click the key, then add restrictions:
  - Application restrictions: HTTP referrers (for browser) or None (for server only). For server use, restrict by IPs.
  - API restrictions: restrict to Places API (and others you enabled).

6) Quotas and cost control
- Monitor usage in the Console. Set budgets/alerts to avoid surprise charges.

7) Environment variable
- Add the API key to your environment or secret manager as `GOOGLE_PLACES_API_KEY`.

8) Quick sample Places endpoint (place details):
- GET https://maps.googleapis.com/maps/api/place/details/json?place_id=<PLACE_ID>&key=<API_KEY>
