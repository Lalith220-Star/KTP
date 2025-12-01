import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

Deno.serve(async (req: Request) => {
  try {
    const auth = req.headers.get('Authorization') || '';
    const token = auth.replace('Bearer ', '').trim();
    if (!token) return new Response(JSON.stringify({ error: 'Missing auth token' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

    const { data: userRes, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userRes?.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    const userId = userRes.user.id;

    const body = await req.json();
    const { restaurant_id, rating, text } = body || {};
    if (!restaurant_id || typeof rating !== 'number') return new Response(JSON.stringify({ error: 'restaurant_id and numeric rating required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const { data, error } = await supabase.from('raw_reviews').insert({ restaurant_id, source: 'app', source_review_id: null, author: null, rating, text, created_at: new Date().toISOString() }).select().single();
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });

    // Optionally insert into reviews table if you want structured reviews owned by user
    await supabase.from('reviews').insert({ restaurant_id, user_id: userId, rating, body: text });

    return new Response(JSON.stringify({ review: data }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
