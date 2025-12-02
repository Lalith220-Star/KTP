# Restaurant Rating Website - Development Guide

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker Desktop (for Supabase local)
- Supabase CLI: `brew install supabase/tap/supabase`

### One-Command Startup

```bash
./scripts/dev.sh
```

This will:
1. Start Supabase local stack (Postgres, Auth, API, Studio)
2. Serve Edge Functions on http://127.0.0.1:54321
3. Launch frontend dev server on http://localhost:3000

### Manual Startup

If you prefer to start services individually:

```bash
# 1. Start Supabase
supabase start

# 2. Serve Edge Functions (in separate terminal)
supabase functions serve --no-verify-jwt

# 3. Start frontend (in separate terminal)
npm run dev
```

## Project Structure

```
.
├── src/                    # Frontend React app
│   ├── components/         # UI components
│   ├── hooks/              # Custom React hooks (useRestaurants)
│   ├── lib/                # Supabase client
│   ├── utils/              # API utilities and data mappers
│   └── App.tsx             # Main application
├── supabase/
│   ├── functions/          # Deno Edge Functions
│   │   ├── get-restaurants/
│   │   ├── get-restaurant/
│   │   ├── create-review/
│   │   ├── watchlist/
│   │   ├── rescore/
│   │   └── _lib/           # Shared utilities (LBH scoring)
│   └── migrations/         # Database migrations
├── backend/
│   ├── data_ingest/        # Python scripts for real data
│   └── scoring/            # LBH scoring TypeScript module
└── scripts/                # Dev scripts

## Environment Variables

The `.env.local` file contains:

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Real Data

The app currently displays **100 real Richardson, TX restaurants** ingested from:
- Google Places API (50 restaurants)
- Yelp Fusion API (50 restaurants)

All restaurants have:
- Real addresses, ratings, and reviews
- LBH scores (85-98.5 range)
- Cuisine types (50% populated from Yelp)

To re-ingest data:

```bash
./scripts/ingest-real-data.sh
```

## Available Services

When running locally:

- **Frontend**: http://localhost:3000
- **Supabase Studio**: http://127.0.0.1:54323
- **Supabase API**: http://127.0.0.1:54321
- **Postgres DB**: postgresql://postgres:postgres@127.0.0.1:54322/postgres

## Edge Functions

| Function | Endpoint | Description |
|----------|----------|-------------|
| get-restaurants | GET /functions/v1/get-restaurants | List restaurants with filters |
| get-restaurant | GET /functions/v1/get-restaurant?id={id} | Single restaurant details |
| create-review | POST /functions/v1/create-review | Submit a review (requires auth) |
| watchlist | GET/POST/DELETE /functions/v1/watchlist | Manage watchlist (requires auth) |
| rescore | POST /functions/v1/rescore | Recompute LBH scores |

## Testing

```bash
# Run LBH scoring tests
npm run test:ts

# Test a specific Edge Function
curl "http://127.0.0.1:54321/functions/v1/get-restaurants?limit=5"

# Rescore all restaurants
curl -X POST "http://127.0.0.1:54321/functions/v1/rescore"
```

## Database

View/edit data in Supabase Studio: http://127.0.0.1:54323

Key tables:
- `restaurants` - Restaurant data
- `raw_reviews` - Customer reviews
- `lbh_scores` - Computed LBH scores
- `watchlists` - User watchlists

## Troubleshooting

### Backend not responding
```bash
# Check functions log
tail -f /tmp/supabase-functions.log

# Restart functions
pkill -f "supabase functions serve"
supabase functions serve --no-verify-jwt
```

### Database issues
```bash
# Reset database
supabase db reset

# Re-run migrations
supabase db push

# View database status
supabase status
```

### Frontend shows demo data
If you see "Using demo data - backend unavailable":
1. Check Supabase is running: `supabase status`
2. Check functions are serving: `curl http://127.0.0.1:54321/functions/v1/get-restaurants?limit=1`
3. Check browser console for errors (F12)

## Next Steps

- ✅ Frontend integrated with backend
- ✅ 100 real restaurants loaded
- ✅ LBH scoring working
- 🔄 Add input validation (Zod schemas)
- 🔄 Improve error handling
- 🔄 Add comprehensive tests
- 🔄 Implement authentication flow

## Learn More

- [Supabase Docs](https://supabase.com/docs)
- [Deno Edge Functions](https://supabase.com/docs/guides/functions)
- [Local Development](https://supabase.com/docs/guides/cli/local-development)
