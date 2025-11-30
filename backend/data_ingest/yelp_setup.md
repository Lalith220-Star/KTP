Yelp Fusion API — how to get an API key

1) Create a Yelp Developers account
- Visit https://www.yelp.com/developers and sign in or create an account.

2) Create an app and get API Key
- In the Yelp Developers console, create a new app (give it a name like Localytics-ingest).
- Once created, you'll see an "API Key" — copy this value. This is your server-side key.

3) Rate limits and terms
- Yelp Fusion has rate limits and usage policies. Review their documentation to ensure your usage is within limits.

4) Environment variable
- Store the key in `YELP_API_KEY` in your environment or secrets manager. Do not commit it to the repo.

5) Quick sample Yelp reviews endpoint (Fusion API doesn't return full review text for all endpoints; check docs):
- GET https://api.yelp.com/v3/businesses/{id}/reviews
- Header: Authorization: Bearer <YELP_API_KEY>
