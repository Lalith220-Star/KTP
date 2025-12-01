-- 002_rls_and_policies.sql
-- Row Level Security policies for reviews, watchlists, and lbh_scores access patterns

-- Enable RLS where appropriate
alter table if exists reviews enable row level security;
alter table if exists raw_reviews enable row level security;
alter table if exists watchlists enable row level security;
alter table if exists lbh_scores enable row level security;

-- Allow public select on restaurants and lbh_scores (read-only public)
-- (You can tighten this later)
drop policy if exists public_select_restaurants on restaurants;
create policy "public_select_restaurants" on restaurants
for select using (true);

drop policy if exists public_select_lbh on lbh_scores;
create policy "public_select_lbh" on lbh_scores
for select using (true);

-- Reviews/raw_reviews: authenticated users can insert; only owners can modify their own entries
drop policy if exists authenticated_insert_raw_reviews on raw_reviews;
create policy "authenticated_insert_raw_reviews" on raw_reviews
for insert with check (auth.role() = 'authenticated');

-- raw_reviews are source data; we allow authenticated inserts but do not
-- create owner-update/delete policies because raw_reviews do not contain
-- an auth-linked `user_id`. Updates/deletes should be performed by the
-- service role (which bypasses RLS) or via a moderation workflow.

drop policy if exists authenticated_insert_reviews on reviews;
create policy "authenticated_insert_reviews" on reviews
for insert with check (auth.role() = 'authenticated');

drop policy if exists owner_modify_reviews on reviews;
-- owner may update their own reviews
create policy "owner_modify_reviews_update" on reviews
for update using (auth.uid() = user_id);

-- owner may delete their own reviews
create policy "owner_modify_reviews_delete" on reviews
for delete using (auth.uid() = user_id);

-- Watchlists: only owner may read/write their watchlist
drop policy if exists watchlist_owner_only on watchlists;
create policy "watchlist_owner_only" on watchlists
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- lbh_scores: allow select to public; writes should be by service role only (no policy needed)
