import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

Deno.serve(async (req: Request) => {
  try {
    const method = req.method;
    const auth = req.headers.get('Authorization') || '';
    const token = auth.replace('Bearer ', '').trim();
    if (!token) return new Response(JSON.stringify({ error: 'Missing auth token' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    const { data: userRes } = await supabase.auth.getUser(token);
    const userId = userRes?.user?.id;
    if (!userId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

    const url = new URL(req.url);
    if (method === 'GET') {
      const { data } = await supabase.from('watchlists').select('restaurant_id').eq('user_id', userId);
      return new Response(JSON.stringify({ watchlist: data }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await req.json();
    if (method === 'POST') {
      const { restaurant_id } = body;
      if (!restaurant_id) return new Response(JSON.stringify({ error: 'restaurant_id required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      const { data, error } = await supabase.from('watchlists').insert({ user_id: userId, restaurant_id }).select().single();
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      return new Response(JSON.stringify({ added: data }), { status: 201, headers: { 'Content-Type': 'application/json' } });
    }

    if (method === 'DELETE') {
      const restaurant_id = url.searchParams.get('restaurant_id');
      if (!restaurant_id) return new Response(JSON.stringify({ error: 'restaurant_id required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      const { error } = await supabase.from('watchlists').delete().eq('user_id', userId).eq('restaurant_id', restaurant_id);
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      return new Response(JSON.stringify({ removed: restaurant_id }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(null, { status: 405 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
