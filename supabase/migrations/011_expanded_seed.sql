-- 011_expanded_seed.sql
-- Expanded seed data with diverse restaurants across multiple cities and rating patterns

-- Insert more restaurants with varied characteristics
insert into restaurants (id, name, address, city, state, zip, cuisine, lat, lng, external_id)
values
  -- San Francisco - High quality restaurants
  ('44444444-4444-4444-4444-444444444444', 'Golden Dragon', '88 Grant Ave', 'San Francisco', 'CA', '94108', 'Chinese', 37.7899, -122.4039, 'g_4444'),
  ('55555555-5555-5555-5555-555555555555', 'Bella Vista', '2000 Union St', 'San Francisco', 'CA', '94123', 'Italian', 37.7971, -122.4323, 'g_5555'),
  ('66666666-6666-6666-6666-666666666666', 'Sushi Zen', '1750 Geary Blvd', 'San Francisco', 'CA', '94115', 'Japanese', 37.7842, -122.4310, 'g_6666'),
  
  -- San Francisco - Mixed quality
  ('77777777-7777-7777-7777-777777777777', 'Burger Shack', '3001 24th St', 'San Francisco', 'CA', '94110', 'American', 37.7529, -122.4091, 'g_7777'),
  ('88888888-8888-8888-8888-888888888888', 'Pho Paradise', '1816 Irving St', 'San Francisco', 'CA', '94122', 'Vietnamese', 37.7637, -122.4782, 'g_8888'),
  
  -- Oakland restaurants
  ('99999999-9999-9999-9999-999999999999', 'Oakland Grill', '5478 College Ave', 'Oakland', 'CA', '94618', 'American', 37.8410, -122.2516, 'g_9999'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Spice Route', '4301 Piedmont Ave', 'Oakland', 'CA', '94611', 'Indian', 37.8273, -122.2415, 'g_aaaa'),
  
  -- Berkeley restaurants
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Campus Cafe', '2367 Telegraph Ave', 'Berkeley', 'CA', '94704', 'American', 37.8672, -122.2589, 'g_bbbb'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Thai House', '2511 Channing Way', 'Berkeley', 'CA', '94704', 'Thai', 37.8667, -122.2555, 'g_cccc'),
  
  -- Problematic restaurant (will have low LBH score)
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'FastBite Express', '500 Market St', 'San Francisco', 'CA', '94102', 'Fast Food', 37.7604, -122.4009, 'g_dddd')
on conflict (id) do nothing;

-- Insert diverse reviews with different patterns

-- Golden Dragon (Consistently excellent - HIGH LBH)
insert into raw_reviews (restaurant_id, source, source_review_id, author, rating, text, created_at)
values
  ('44444444-4444-4444-4444-444444444444', 'google', 'gd1', 'Jennifer K.', 5, 'Best dim sum in the city! Fresh ingredients and attentive service.', now()-interval '60 days'),
  ('44444444-4444-4444-4444-444444444444', 'yelp', 'gd2', 'Michael T.', 5, 'Absolutely phenomenal. The Peking duck was perfect.', now()-interval '45 days'),
  ('44444444-4444-4444-4444-444444444444', 'google', 'gd3', 'Sarah L.', 5, 'Amazing food, great atmosphere. Will definitely come back!', now()-interval '30 days'),
  ('44444444-4444-4444-4444-444444444444', 'yelp', 'gd4', 'David R.', 4, 'Really good food, though a bit pricey. Worth it though!', now()-interval '20 days'),
  ('44444444-4444-4444-4444-444444444444', 'google', 'gd5', 'Emma W.', 5, 'Incredible experience from start to finish.', now()-interval '10 days'),
  ('44444444-4444-4444-4444-444444444444', 'yelp', 'gd6', 'Robert C.', 5, 'The best Chinese restaurant I have ever been to.', now()-interval '5 days'),
  ('44444444-4444-4444-4444-444444444444', 'google', 'gd7', 'Lisa M.', 5, 'Outstanding quality and service every time.', now()-interval '2 days')
on conflict do nothing;

-- Bella Vista (Good but slightly inconsistent - MEDIUM-HIGH LBH)
insert into raw_reviews (restaurant_id, source, source_review_id, author, rating, text, created_at)
values
  ('55555555-5555-5555-5555-555555555555', 'google', 'bv1', 'Tony P.', 5, 'Excellent pasta, reminded me of my trip to Italy.', now()-interval '90 days'),
  ('55555555-5555-5555-5555-555555555555', 'yelp', 'bv2', 'Maria G.', 4, 'Good food but service was a bit slow on Friday night.', now()-interval '75 days'),
  ('55555555-5555-5555-5555-555555555555', 'google', 'bv3', 'John D.', 5, 'Amazing risotto and wine selection!', now()-interval '60 days'),
  ('55555555-5555-5555-5555-555555555555', 'yelp', 'bv4', 'Anna S.', 3, 'Food was good but my pasta was undercooked.', now()-interval '40 days'),
  ('55555555-5555-5555-5555-555555555555', 'google', 'bv5', 'Peter J.', 4, 'Nice atmosphere and decent portions.', now()-interval '25 days'),
  ('55555555-5555-5555-5555-555555555555', 'yelp', 'bv6', 'Sophie B.', 5, 'Loved everything about this place!', now()-interval '10 days')
on conflict do nothing;

-- Sushi Zen (High quality, consistent - HIGH LBH)
insert into raw_reviews (restaurant_id, source, source_review_id, author, rating, text, created_at)
values
  ('66666666-6666-6666-6666-666666666666', 'google', 'sz1', 'Kevin L.', 5, 'Fresh fish, expert preparation. Best sushi in SF.', now()-interval '50 days'),
  ('66666666-6666-6666-6666-666666666666', 'yelp', 'sz2', 'Rachel H.', 5, 'The omakase was incredible. Chef is very talented.', now()-interval '35 days'),
  ('66666666-6666-6666-6666-666666666666', 'google', 'sz3', 'Daniel K.', 4, 'Great sushi, a bit expensive but worth the quality.', now()-interval '20 days'),
  ('66666666-6666-6666-6666-666666666666', 'yelp', 'sz4', 'Michelle T.', 5, 'Absolutely perfect. Fresh ingredients and beautiful presentation.', now()-interval '12 days'),
  ('66666666-6666-6666-6666-666666666666', 'google', 'sz5', 'Chris P.', 5, 'Best Japanese restaurant in the Bay Area.', now()-interval '5 days')
on conflict do nothing;

-- Burger Shack (Declining quality - MEDIUM-LOW LBH)
insert into raw_reviews (restaurant_id, source, source_review_id, author, rating, text, created_at)
values
  ('77777777-7777-7777-7777-777777777777', 'google', 'bs1', 'Alex M.', 4, 'Used to be great, still pretty good burgers.', now()-interval '120 days'),
  ('77777777-7777-7777-7777-777777777777', 'yelp', 'bs2', 'Jessica F.', 4, 'Solid burger joint, nothing fancy but hits the spot.', now()-interval '90 days'),
  ('77777777-7777-7777-7777-777777777777', 'google', 'bs3', 'Brandon W.', 3, 'Quality has gone down. Burger was dry.', now()-interval '60 days'),
  ('77777777-7777-7777-7777-777777777777', 'yelp', 'bs4', 'Lauren P.', 2, 'Very disappointed. Long wait and cold fries.', now()-interval '30 days'),
  ('77777777-7777-7777-7777-777777777777', 'google', 'bs5', 'Tim R.', 3, 'Not as good as it used to be. Service is slow now.', now()-interval '15 days'),
  ('77777777-7777-7777-7777-777777777777', 'yelp', 'bs6', 'Nicole J.', 2, 'Overpriced for what you get. Would not recommend.', now()-interval '5 days')
on conflict do nothing;

-- Pho Paradise (Good and consistent - MEDIUM-HIGH LBH)
insert into raw_reviews (restaurant_id, source, source_review_id, author, rating, text, created_at)
values
  ('88888888-8888-8888-8888-888888888888', 'google', 'pp1', 'Andrew N.', 4, 'Great pho, authentic flavors. Good value.', now()-interval '80 days'),
  ('88888888-8888-8888-8888-888888888888', 'yelp', 'pp2', 'Tiffany L.', 5, 'Best Vietnamese food in the neighborhood!', now()-interval '60 days'),
  ('88888888-8888-8888-8888-888888888888', 'google', 'pp3', 'Mark S.', 4, 'Delicious broth, generous portions.', now()-interval '45 days'),
  ('88888888-8888-8888-8888-888888888888', 'yelp', 'pp4', 'Amy C.', 4, 'Always reliable, fresh ingredients.', now()-interval '30 days'),
  ('88888888-8888-8888-8888-888888888888', 'google', 'pp5', 'Steve H.', 5, 'My go-to spot for pho. Never disappoints.', now()-interval '10 days')
on conflict do nothing;

-- Oakland Grill (Mixed reviews - MEDIUM LBH)
insert into raw_reviews (restaurant_id, source, source_review_id, author, rating, text, created_at)
values
  ('99999999-9999-9999-9999-999999999999', 'google', 'og1', 'Patricia V.', 3, 'Food was okay, nothing special.', now()-interval '70 days'),
  ('99999999-9999-9999-9999-999999999999', 'yelp', 'og2', 'James B.', 4, 'Good neighborhood spot for casual dining.', now()-interval '50 days'),
  ('99999999-9999-9999-9999-999999999999', 'google', 'og3', 'Karen W.', 2, 'Service was terrible, food took forever.', now()-interval '35 days'),
  ('99999999-9999-9999-9999-999999999999', 'yelp', 'og4', 'Richard T.', 4, 'Had a good burger and beer. Friendly staff.', now()-interval '20 days')
on conflict do nothing;

-- Spice Route (Excellent - HIGH LBH)
insert into raw_reviews (restaurant_id, source, source_review_id, author, rating, text, created_at)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'google', 'sr1', 'Priya S.', 5, 'Authentic Indian flavors, reminds me of home!', now()-interval '100 days'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'yelp', 'sr2', 'William G.', 5, 'Best Indian food in Oakland. Exceptional service.', now()-interval '75 days'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'google', 'sr3', 'Linda K.', 5, 'The butter chicken is to die for!', now()-interval '50 days'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'yelp', 'sr4', 'Thomas M.', 4, 'Great food, good portions. Slightly slow service.', now()-interval '30 days'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'google', 'sr5', 'Susan R.', 5, 'Amazing naan and perfectly spiced curries.', now()-interval '15 days')
on conflict do nothing;

-- Campus Cafe (Student favorite - MEDIUM LBH)
insert into raw_reviews (restaurant_id, source, source_review_id, author, rating, text, created_at)
values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'google', 'cc1', 'Emily S.', 4, 'Great coffee and sandwiches. Perfect study spot.', now()-interval '40 days'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'yelp', 'cc2', 'Jason L.', 3, 'Good for students, but can get crowded.', now()-interval '25 days'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'google', 'cc3', 'Olivia M.', 4, 'Nice atmosphere, decent food, good wifi.', now()-interval '10 days')
on conflict do nothing;

-- Thai House (Good quality - MEDIUM-HIGH LBH)
insert into raw_reviews (restaurant_id, source, source_review_id, author, rating, text, created_at)
values
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'google', 'th1', 'Nathan P.', 4, 'Solid Thai food, good pad thai.', now()-interval '55 days'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'yelp', 'th2', 'Melissa D.', 5, 'Love this place! Great curries and friendly owners.', now()-interval '40 days'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'google', 'th3', 'Ryan B.', 4, 'Fresh ingredients, authentic taste.', now()-interval '20 days'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'yelp', 'th4', 'Hannah C.', 4, 'Great value for the quality. Recommended!', now()-interval '8 days')
on conflict do nothing;

-- FastBite Express (Poor quality, declining - LOW LBH)
insert into raw_reviews (restaurant_id, source, source_review_id, author, rating, text, created_at)
values
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'google', 'fb1', 'Greg H.', 2, 'Food was mediocre at best. Not fresh.', now()-interval '90 days'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'yelp', 'fb2', 'Sharon K.', 1, 'Terrible experience. Rude staff and cold food.', now()-interval '70 days'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'google', 'fb3', 'Paul T.', 2, 'Place has really gone downhill. Dirty tables.', now()-interval '50 days'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'yelp', 'fb4', 'Diana F.', 1, 'Would give zero stars if I could. Avoid!', now()-interval '30 days'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'google', 'fb5', 'Victor L.', 2, 'Not worth the money. Very disappointing.', now()-interval '15 days'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'yelp', 'fb6', 'Brenda M.', 1, 'Health inspection needed. Gross.', now()-interval '5 days')
on conflict do nothing;

-- Add some job postings for restaurants showing instability
insert into job_posts (restaurant_id, source, title, posted_at)
values
  ('77777777-7777-7777-7777-777777777777', 'indeed', 'Line Cook Needed ASAP', now()-interval '20 days'),
  ('77777777-7777-7777-7777-777777777777', 'craigslist', 'Server Position - Immediate Start', now()-interval '10 days'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'indeed', 'Multiple Positions Open', now()-interval '40 days'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'indeed', 'Kitchen Staff Urgently Needed', now()-interval '25 days'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'craigslist', 'All Positions - High Turnover', now()-interval '10 days')
on conflict do nothing;

-- Add hours changes for declining restaurants
insert into hours_changes (restaurant_id, field, old_value, new_value, changed_at)
values
  ('77777777-7777-7777-7777-777777777777', 'hours', '9AM-10PM', '10AM-9PM', now()-interval '45 days'),
  ('77777777-7777-7777-7777-777777777777', 'hours', '10AM-9PM', '11AM-8PM', now()-interval '15 days'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'hours', '7AM-11PM', '8AM-10PM', now()-interval '60 days'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'hours', '8AM-10PM', '9AM-9PM', now()-interval '30 days'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'hours', '9AM-9PM', '10AM-8PM', now()-interval '10 days')
on conflict do nothing;
