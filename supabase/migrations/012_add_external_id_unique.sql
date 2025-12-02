-- 012_add_external_id_unique.sql
-- Add unique constraint on external_id to allow upserts from data ingestion

-- Add unique constraint on external_id (allows NULL, but duplicates are not allowed)
create unique index if not exists restaurants_external_id_key on restaurants(external_id) where external_id is not null;
