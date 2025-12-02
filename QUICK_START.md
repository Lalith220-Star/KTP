# 🍽️ Restaurant Rating Website - Quick Reference

## Start the App (One Command)
```bash
./scripts/dev.sh
```

## URLs
- **App**: http://localhost:3000 ← Open this in your browser
- **Database UI**: http://127.0.0.1:54323
- **API**: http://127.0.0.1:54321

## What You'll See
- **100 real restaurants** from Richardson, TX
- **LBH scores** from 85-98.5 (Sentiment + Consistency + Stability)
- **Real reviews** from Google & Yelp
- **Working filters** by cuisine, score, price
- **Interactive map** with GPS coordinates

## Top Restaurants (by LBH Score)
1. **Dimassi's Mediterranean Buffet** - 98.50
2. **Partenope Ristorante** - 97.50
3. **Porta Di Roma** - 97.50
4. **Dos Arroyos Comida Casera** - 97.50
5. **Texas de Brazil** - 96.75

## Quick Tests

### Test 1: View All Restaurants
- Open http://localhost:3000
- Should see 100 restaurants loaded
- Top restaurants by score displayed first

### Test 2: Filter by Cuisine
- Click "Filter" button
- Select "Mexican" or "Italian"
- See filtered results

### Test 3: View Restaurant Details
- Click any restaurant card
- See full details, reviews, LBH breakdown
- Check score components (Customer Sentiment, Operational Consistency, Talent Stability)

### Test 4: Check Database
- Open http://127.0.0.1:54323
- Click "Table Editor"
- View `restaurants` table (100 rows)
- View `lbh_scores` table (100 rows)
- View `raw_reviews` table (200+ reviews)

### Test 5: API Call
```bash
curl "http://127.0.0.1:54321/functions/v1/get-restaurants?limit=5&min_lbh=95" | jq
```
Should return top 5 restaurants with LBH ≥ 95

## Troubleshooting

### "Backend unavailable" toast
```bash
# Check if functions are running
curl http://127.0.0.1:54321/functions/v1/get-restaurants?limit=1

# Restart if needed
pkill -f "supabase functions serve"
supabase functions serve --no-verify-jwt
```

### No restaurants showing
```bash
# Check database
supabase status

# Check restaurant count
curl "http://127.0.0.1:54321/rest/v1/restaurants?select=count" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Port already in use
```bash
# Kill processes on port 3000
lsof -ti:3000 | xargs kill

# Or use different port
npm run dev -- --port 3001
```

## Demo Script

**Step 1** - Start everything
```bash
./scripts/dev.sh
```

**Step 2** - Open app
- Go to http://localhost:3000
- See "Loaded 100 restaurants from Richardson, TX" toast

**Step 3** - Browse restaurants
- Scroll through cards
- Note LBH scores (85-98 range)
- See real addresses

**Step 4** - Click top restaurant
- View details page
- See reviews
- Check LBH breakdown

**Step 5** - Open database
- Go to http://127.0.0.1:54323
- Browse tables
- Run SQL query

**Step 6** - Show API
```bash
curl "http://127.0.0.1:54321/functions/v1/get-restaurants?cuisine=Mexican&limit=10"
```

## Files to Show

### Backend Code
- `supabase/functions/get-restaurants/index.ts` - List restaurants API
- `supabase/functions/_lib/lbh.ts` - Scoring algorithm
- `supabase/migrations/001_lbh_schema.sql` - Database schema

### Frontend Code
- `src/App.tsx` - Lines 134-165 (useRestaurants integration)
- `src/hooks/useRestaurants.ts` - Data fetching
- `src/utils/dataMappers.ts` - Backend → Frontend mapping

### Data Ingestion
- `backend/data_ingest/google_ingest.py` - Google Places
- `backend/data_ingest/yelp_ingest.py` - Yelp Fusion

## Key Metrics
- **Restaurants**: 100 real (Richardson, TX)
- **Reviews**: 200+ from APIs
- **API Response**: ~50-100ms
- **LBH Range**: 85.0 - 98.5
- **Cuisine Coverage**: 50% (Yelp data)
- **Edge Functions**: 5 working
- **Database Tables**: 7 with RLS

## Stop the App
```bash
# Stop frontend (Ctrl+C in terminal)
# Stop functions
pkill -f "supabase functions serve"

# Stop Supabase
supabase stop
```

---

**Ready to present!** 🎤

Your app has 100 real restaurants with working backend integration.
