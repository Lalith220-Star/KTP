-- 010_seed.sql
-- Seed a few demo restaurants and raw_reviews for frontend/dev use

insert into restaurants (id, name, address, city, state, zip, cuisine, lat, lng, external_id)
values
  ('11111111-1111-1111-1111-111111111111', 'La Piazza', '123 Main St', 'San Francisco', 'CA', '94103', 'Italian', 37.7749, -122.4194, 'g_1111'),
  ('22222222-2222-2222-2222-222222222222', 'Taco House', '456 Elm Ave', 'San Francisco', 'CA', '94103', 'Mexican', 37.7755, -122.4189, 'g_2222'),
  ('33333333-3333-3333-3333-333333333333', 'Curry Corner', '789 Oak Blvd', 'San Francisco', 'CA', '94103', 'Indian', 37.7762, -122.4170, 'g_3333')
on conflict (id) do nothing;

insert into raw_reviews (restaurant_id, source, source_review_id, author, rating, text, created_at)
values
  ('11111111-1111-1111-1111-111111111111', 'google', 'gr1', 'Alice', 5, 'Amazing pasta and friendly staff.', now()-interval '30 days'),
  ('11111111-1111-1111-1111-111111111111', 'yelp', 'yr1', 'Bob', 4, 'Great food but a little slow at dinner.', now()-interval '15 days'),
  ('22222222-2222-2222-2222-222222222222', 'google', 'gr2', 'Carlos', 3, 'Tacos were okay, service was quick.', now()-interval '10 days'),
  ('33333333-3333-3333-3333-333333333333', 'yelp', 'yr3', 'Dina', 2, 'Food was cold and service rude.', now()-interval '5 days')
on conflict do nothing;

-- Precompute simple LBH values for demo purposes (these will be overwritten by rescore)
insert into lbh_scores (restaurant_id, lbh, sentiment_score, consistency_score, stability_score, last_scored_at)
values
  ('11111111-1111-1111-1111-111111111111', 86.50, 88.00, 90.00, 77.50, now()),
  ('22222222-2222-2222-2222-222222222222', 70.25, 72.00, 80.00, 59.75, now()),
  ('33333333-3333-3333-3333-333333333333', 34.10, 30.00, 60.00, 12.30, now())
on conflict (restaurant_id) do update set lbh = excluded.lbh, sentiment_score = excluded.sentiment_score, consistency_score = excluded.consistency_score, stability_score = excluded.stability_score, last_scored_at = excluded.last_scored_at;
