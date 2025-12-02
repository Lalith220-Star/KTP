#!/bin/bash
# Script to ingest real restaurant data from Google Places

set -e

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Check for required environment variables
if [ -z "$GOOGLE_PLACES_API_KEY" ]; then
    echo "❌ Error: GOOGLE_PLACES_API_KEY not set"
    echo ""
    echo "Get your key from: https://console.cloud.google.com/apis/credentials"
    echo "Then run: export GOOGLE_PLACES_API_KEY=\"your-key-here\""
    exit 1
fi

# Set database URL for local Supabase
export DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"

echo "=== Starting Real Data Ingestion ==="
echo ""
echo "🔍 Fetching restaurants from Google Places..."
echo ""

# Clear existing seed data (optional)
read -p "⚠️  Clear existing seed data first? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Clearing restaurants and reviews..."
    psql "$DATABASE_URL" -c "TRUNCATE restaurants CASCADE;"
    echo "✅ Cleared"
fi

# Ingest San Francisco restaurants
echo ""
echo "📍 Ingesting San Francisco restaurants..."
python3 backend/data_ingest/google_ingest.py \
    --query "restaurants in San Francisco" \
    --limit 50 \
    --database-url "$DATABASE_URL" \
    --api-key "$GOOGLE_PLACES_API_KEY"

echo ""
echo "📍 Ingesting Oakland restaurants..."
python3 backend/data_ingest/google_ingest.py \
    --query "restaurants in Oakland CA" \
    --limit 30 \
    --database-url "$DATABASE_URL" \
    --api-key "$GOOGLE_PLACES_API_KEY"

echo ""
echo "📍 Ingesting Berkeley restaurants..."
python3 backend/data_ingest/google_ingest.py \
    --query "restaurants in Berkeley CA" \
    --limit 20 \
    --database-url "$DATABASE_URL" \
    --api-key "$GOOGLE_PLACES_API_KEY"

echo ""
echo "✅ Ingestion complete!"
echo ""
echo "🔄 Computing LBH scores..."
curl -X POST "http://127.0.0.1:54321/functions/v1/rescore" 2>&1 | grep -o '{.*}'

echo ""
echo ""
echo "✅ All done! View your restaurants:"
echo "   http://127.0.0.1:54323 (Supabase Studio)"
echo ""
echo "Or query via API:"
echo "   curl 'http://127.0.0.1:54321/functions/v1/get-restaurants?limit=10'"
