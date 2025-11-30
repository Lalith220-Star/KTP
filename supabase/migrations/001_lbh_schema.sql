-- 001_lbh_schema.sql
-- Core schema for Localytics
-- Tables: restaurants, raw_reviews, reviews, job_posts, hours_changes, watchlists, lbh_scores

create extension if not exists pgcrypto;

create table if not exists restaurants (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  address text,
  city text,
  state text,
  zip text,
  country text default 'US',
  lat numeric,
  lng numeric,
  cuisine text,
  external_id text, -- id from source (Google/Yelp)
  created_at timestamptz default now()
);

create table if not exists raw_reviews (
  id uuid default gen_random_uuid() primary key,
  restaurant_id uuid references restaurants(id) on delete cascade,
  source text not null,
  source_review_id text,
  author text,
  rating int,
  text text,
  created_at timestamptz,
  ingested_at timestamptz default now()
);

create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  restaurant_id uuid references restaurants(id) on delete cascade,
  user_id uuid,
  rating int check (rating >= 1 and rating <= 5),
  body text,
  created_at timestamptz default now()
);

create table if not exists job_posts (
  id uuid default gen_random_uuid() primary key,
  restaurant_id uuid references restaurants(id) on delete cascade,
  source text,
  title text,
  posted_at timestamptz,
  ingested_at timestamptz default now()
);

create table if not exists hours_changes (
  id uuid default gen_random_uuid() primary key,
  restaurant_id uuid references restaurants(id) on delete cascade,
  field text,
  old_value text,
  new_value text,
  changed_at timestamptz,
  ingested_at timestamptz default now()
);

create table if not exists watchlists (
  user_id uuid references auth.users(id) on delete cascade,
  restaurant_id uuid references restaurants(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, restaurant_id)
);

-- Materialized table for computed LBH scores
create table if not exists lbh_scores (
  restaurant_id uuid primary key references restaurants(id) on delete cascade,
  lbh numeric(5,2) not null default 0,
  sentiment_score numeric(5,2) not null default 0,
  consistency_score numeric(5,2) not null default 0,
  stability_score numeric(5,2) not null default 0,
  last_scored_at timestamptz default now()
);

create index if not exists idx_restaurants_city on restaurants(city);
create index if not exists idx_restaurants_cuisine on restaurants(cuisine);
