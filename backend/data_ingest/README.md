Data acquisition instructions and sample scripts

Overview
This folder contains instructions and starter code to ingest public data for Localytics. We prefer API-first ingestion (Google Places, Yelp Fusion) — it's reliable and respects provider terms. If you must scrape, follow legal guidance and rate limits but be aware of TOS restrictions.

API keys: quick summary
- Google Places API: get an API key via Google Cloud Console, enable Places API and Maps/Geocoding if needed. You must enable billing to use Places.
- Yelp Fusion API: create a Yelp Developers account and create an app to receive an API Key.

Files
- `google_places_setup.md` — step-by-step to obtain a Google API key.
- `yelp_setup.md` — step-by-step to obtain a Yelp API key.
- `sample_ingest.py` — sample Python script that demonstrates requesting reviews and place details (requires keys).

Google Places ingestion
-----------------------
I added `google_ingest.py` which searches Google Places (Text Search) and fetches Place Details for each place.

Usage:

```bash
export GOOGLE_PLACES_API_KEY="<your-key>"
export DATABASE_URL="postgres://user:pass@host:5432/dbname"
python backend/data_ingest/google_ingest.py --query "restaurants in San Francisco" --limit 200
```

Notes:
- Do NOT commit your API key. Use environment variables or a secret manager. This repository intentionally does not store keys.
- The Places API may require enabling billing. Monitor quotas and set budgets.
- The script will insert place metadata into `restaurants` and reviews into `raw_reviews`.


Yelp Open Dataset loader
------------------------
If you don't have Yelp API access, you can use the Yelp Open Dataset for prototyping.

I added `load_yelp_open_dataset.py` — it reads `business.json` and `review.json` (line-delimited JSON) and upserts into the `restaurants` and `raw_reviews` tables.

Quick start:
1. Download the Yelp Open Dataset from https://www.yelp.com/dataset and unzip to a folder, e.g. `data/yelp`.
2. Create a Postgres database (or use your Supabase Postgres) and set `DATABASE_URL`.
3. Install requirements:
	```bash
	pip install -r backend/data_ingest/requirements.txt
	```
4. Run the loader (small limits recommended at first):
	```bash
	export DATABASE_URL="postgres://user:pass@host:5432/dbname"
	python backend/data_ingest/load_yelp_open_dataset.py --data-dir data/yelp --business-limit 500 --review-limit 2000
	```

Yelp Fusion API ingestion
-------------------------
If you obtain a Yelp Fusion API key, you can ingest live Yelp data directly (recommended for production).

I added `yelp_ingest.py` which searches businesses and fetches reviews via Yelp Fusion. Usage:

```bash
export YELP_API_KEY="<your-key>"
export DATABASE_URL="postgres://user:pass@host:5432/dbname"
python backend/data_ingest/yelp_ingest.py --location "San Francisco, CA" --term "restaurants" --limit 200
```

Notes:
- Yelp's reviews endpoint returns at most 3 reviews per business. This is OK for signal extraction but not for full historical archives.
- The script includes basic rate-limit handling and sleeps between calls; adjust `--sleep` if you hit limits.
- Install requirements:

```bash
pip install -r backend/data_ingest/requirements.txt
```


Legal note
Only ingest public data available through official APIs. Scraping can violate terms; always check provider ToS. For production, prefer API-based ingestion.
