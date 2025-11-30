-- 002_rls_and_policies.sql
-- Row Level Security policies for reviews, watchlists, and lbh_scores access patterns

-- Enable RLS where appropriate
alter table if exists reviews enable row level security;
alter table if exists raw_reviews enable row level security;
alter table if exists watchlists enable row level security;
alter table if exists lbh_scores enable row level security;

-- Allow public select on restaurants and lbh_scores (read-only public)
-- (You can tighten this later)
create policy if not exists "public_select_restaurants" on restaurants
for select using (true);

create policy if not exists "public_select_lbh" on lbh_scores
for select using (true);

-- Reviews/raw_reviews: authenticated users can insert; only owners can modify their own entries
create policy if not exists "authenticated_insert_raw_reviews" on raw_reviews
for insert using (auth.role() = 'authenticated');

create policy if not exists "owner_modify_raw_reviews" on raw_reviews
for update, delete using (auth.uid() = user_id);

create policy if not exists "authenticated_insert_reviews" on reviews
for insert using (auth.role() = 'authenticated');

create policy if not exists "owner_modify_reviews" on reviews
for update, delete using (auth.uid() = user_id);

-- Watchlists: only owner may read/write their watchlist
create policy if not exists "watchlist_owner_only" on watchlists
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- lbh_scores: allow select to public; writes should be by service role only (no policy needed)
