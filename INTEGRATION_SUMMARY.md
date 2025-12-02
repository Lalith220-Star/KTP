# Restaurant Rating Website - Integration Complete! 🎉

## What We Built

A full-stack restaurant rating platform with:
- **Frontend**: React + TypeScript + Vite
- **Backend**: Supabase (Postgres + Edge Functions)
- **Real Data**: 100 Richardson, TX restaurants
- **Scoring**: Custom LBH algorithm (Sentiment + Consistency + Stability)

## Live Demo URLs

When running locally:
- **App**: http://localhost:3000
- **Database Studio**: http://127.0.0.1:54323
- **API**: http://127.0.0.1:54321

## Start Everything

```bash
./scripts/dev.sh
```

Or manually:
```bash
# Terminal 1: Supabase
supabase start

# Terminal 2: Edge Functions
supabase functions serve --no-verify-jwt

# Terminal 3: Frontend
npm run dev
```

## Key Features Integrated

### ✅ Real Restaurant Data
- **100 restaurants** from Richardson, TX
- Sourced from Google Places API (50) + Yelp API (50)
- Real addresses, ratings, reviews, and phone numbers
- LBH scores range: 85.0 - 98.5

### ✅ Backend API (5 Edge Functions)
1. **get-restaurants** - List with filters (city, cuisine, min_lbh, pagination)
2. **get-restaurant** - Single restaurant with reviews
3. **create-review** - Submit authenticated reviews
4. **watchlist** - Manage user watchlists
5. **rescore** - Recompute LBH scores

### ✅ LBH Scoring System
```
LBH Score = (Sentiment × 40%) + (Consistency × 30%) + (Stability × 30%)
```
- **Sentiment**: Customer review ratings (1-5 stars)
- **Consistency**: Rating variance (low variance = high consistency)
- **Stability**: Hours changes + job postings (low churn = high stability)

### ✅ Database Schema
7 tables with Row Level Security (RLS):
- `restaurants` - Core restaurant data
- `raw_reviews` - Customer reviews from all sources
- `reviews` - User-submitted reviews
- `lbh_scores` - Computed scores (updated automatically)
- `job_posts` - Job posting signals
- `hours_changes` - Hours change signals
- `watchlists` - User watchlist tracking

## Demo Flow

### 1. Browse Restaurants
- App loads 100 real Richardson restaurants
- Sorted by LBH score (highest first)
- Shows top performers: Dimassi's (98.5), Partenope (97.5), etc.

### 2. View Details
- Click any restaurant card
- See full details, reviews, LBH breakdown
- Map view with real coordinates

### 3. Filter & Search
- Filter by cuisine type (Mexican, Italian, Seafood, etc.)
- Filter by LBH score range
- Filter by price level
- Search by name or address

### 4. Backend Insights
- View in Supabase Studio: http://127.0.0.1:54323
- See all 100 restaurants in database
- Inspect reviews, scores, and signals
- Run custom SQL queries

## Sample API Calls

```bash
# Get top 10 restaurants
curl "http://127.0.0.1:54321/functions/v1/get-restaurants?limit=10"

# Filter by cuisine
curl "http://127.0.0.1:54321/functions/v1/get-restaurants?cuisine=Mexican"

# Get restaurant details
curl "http://127.0.0.1:54321/functions/v1/get-restaurant?id=<uuid>"

# Rescore all restaurants
curl -X POST "http://127.0.0.1:54321/functions/v1/rescore"
```

## Database Query Examples

Open Studio (http://127.0.0.1:54323) and try:

```sql
-- Top 10 restaurants by LBH score
SELECT r.name, r.cuisine, l.lbh, l.sentiment_score, l.consistency_score, l.stability_score
FROM restaurants r
JOIN lbh_scores l ON r.id = l.restaurant_id
ORDER BY l.lbh DESC
LIMIT 10;

-- Restaurants with most reviews
SELECT r.name, COUNT(rv.id) as review_count
FROM restaurants r
LEFT JOIN raw_reviews rv ON r.id = rv.restaurant_id
GROUP BY r.id, r.name
ORDER BY review_count DESC
LIMIT 10;

-- Average LBH by cuisine
SELECT r.cuisine, AVG(l.lbh) as avg_lbh, COUNT(*) as count
FROM restaurants r
JOIN lbh_scores l ON r.id = l.restaurant_id
WHERE r.cuisine IS NOT NULL
GROUP BY r.cuisine
ORDER BY avg_lbh DESC;
```

## Technical Highlights

### Frontend Architecture
- **Custom Hook**: `useRestaurants` - Auto-fetches from backend
- **Data Mappers**: Transform backend UUIDs → frontend integers
- **Fallback**: Shows demo data if backend unavailable
- **Loading States**: Skeleton screens while fetching

### Backend Architecture
- **Deno Edge Functions**: TypeScript running on the edge
- **Shared Scoring Module**: Same LBH code for frontend + backend
- **RLS Policies**: Secure data access
- **Auto-refresh**: JWT tokens for auth

### Data Pipeline
```
Google Places API → Python Script → Postgres
     ↓                                ↓
Yelp Fusion API → Python Script → raw_reviews → LBH Scoring → lbh_scores
                                         ↓
                                   Edge Functions → Frontend
```

## What's Different from Mock Data

| Feature | Mock Data (Before) | Real Data (Now) |
|---------|-------------------|-----------------|
| Restaurants | 20 hardcoded | 100 from APIs |
| Addresses | Fake | Real GPS coordinates |
| Reviews | 9 generic | 200+ real reviews |
| Scores | Random 75-95 | Computed LBH 85-98.5 |
| Cuisines | All populated | 50% from Yelp |
| Source | Frontend file | Supabase backend |

## Presentation Tips

1. **Start with the frontend** (http://localhost:3000)
   - Show restaurant list sorted by score
   - Click top restaurant to show details
   - Demonstrate filters (cuisine, score range)

2. **Open Database Studio** (http://127.0.0.1:54323)
   - Show 100 real restaurants in table
   - Show lbh_scores join with restaurants
   - Run a live SQL query

3. **Call API directly** (Terminal)
   ```bash
   curl "http://127.0.0.1:54321/functions/v1/get-restaurants?limit=5" | jq
   ```

4. **Explain LBH Scoring**
   - Show how scores range 85-98.5 (realistic)
   - Explain components: Sentiment, Consistency, Stability
   - Show score breakdown in restaurant detail

5. **Highlight Real Data**
   - 100 Richardson, TX restaurants
   - From Google Places + Yelp
   - Real reviews, addresses, phone numbers

## Known Limitations

- ⚠️ Cuisine type missing for 50 Google restaurants (API limitation)
- ⚠️ Add business / claim features commented out (need backend endpoints)
- ⚠️ Auth flow not fully integrated (JWT tokens work, UI pending)
- ⚠️ Some TypeScript errors (tsconfig needs frontend inclusion)

## Future Enhancements

- 🔄 Complete auth integration (sign up, sign in, profiles)
- 🔄 Claim restaurant flow (business owners)
- 🔄 Submit reviews (needs authenticated user)
- 🔄 Watchlist sync with backend
- 🔄 Add more cities (Dallas, Plano, Frisco)
- 🔄 Real-time score updates
- 🔄 Email notifications
- 🔄 Deploy to production (Vercel + Supabase Cloud)

## Files Modified/Created

**Frontend Integration:**
- `.env.local` - Environment variables
- `src/lib/supabase.ts` - Supabase client
- `src/hooks/useRestaurants.ts` - Data fetching hook
- `src/utils/dataMappers.ts` - Backend → Frontend transformation
- `src/App.tsx` - Integrated real data loading

**Documentation:**
- `DEVELOPMENT.md` - Full dev guide
- `INTEGRATION_SUMMARY.md` - This file
- `scripts/dev.sh` - One-command startup

## Support

If something doesn't work:
1. Check `supabase status` - All services green?
2. Check functions log: `tail -f /tmp/supabase-functions.log`
3. Check browser console (F12) for errors
4. Restart everything: `./scripts/dev.sh`

---

**You're all set!** 🚀

Run `./scripts/dev.sh` and open http://localhost:3000 to see your 100 real Richardson restaurants!
