#!/usr/bin/env bash
set -euo pipefail

# Run seed SQL against a Postgres database. Set DATABASE_URL or SUPABASE_DB_URL.
DB_URL=${DATABASE_URL:-${SUPABASE_DB_URL:-}}
if [ -z "$DB_URL" ]; then
  echo "DATABASE_URL or SUPABASE_DB_URL must be set to run the seed script"
  exit 1
fi

SQL_FILE="$(dirname "$0")/../supabase/migrations/010_seed.sql"
if [ ! -f "$SQL_FILE" ]; then
  echo "Seed SQL not found at $SQL_FILE"
  exit 1
fi

echo "Running seed SQL against $DB_URL"
psql "$DB_URL" -f "$SQL_FILE"
echo "Seed completed."
