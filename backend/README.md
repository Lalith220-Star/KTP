Backend (Localytics) — local dev and testing

What this folder contains
- Data ingestion helpers and docs in `backend/data_ingest/`
- Scoring engine in `backend/scoring/`

Quick local checks
1) Run LBH scoring tests (requires node dev dependencies installed):

   npm install
   npm run test:ts

2) Run seed SQL (requires psql and a DATABASE_URL pointing to your Postgres instance):

   export DATABASE_URL="postgres://user:pass@host:5432/dbname"
   npm run seed:run

Notes
- Edge Functions and Supabase parts remain in `supabase/`. You can use the Supabase CLI to serve functions locally and they will use the Deno-compatible scoring helper under `supabase/functions/_lib/lbh.ts`.
- The scoring engine is intentionally simple and lives in TypeScript for easy sharing between frontend and server later.
