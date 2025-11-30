import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

export default async function (req: Request) {
  try {
    const url = new URL(req.url);
    const city = url.searchParams.get('city');
    const cuisine = url.searchParams.get('cuisine');
    const min_lbh = url.searchParams.get('min_lbh') ? Number(url.searchParams.get('min_lbh')) : 0;
    const limit = Number(url.searchParams.get('limit') || '20');
    const offset = Number(url.searchParams.get('offset') || '0');

    // join restaurants with lbh_scores
    let query = supabase.from('restaurants').select('id,name,address,city,state,cuisine,lat,lng,lbh_scores(lbh,sentiment_score,consistency_score,stability_score,last_scored_at)').range(offset, offset + limit - 1);

    if (city) query = query.eq('city', city);
    if (cuisine) query = query.eq('cuisine', cuisine);

    const { data, error } = await query;
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    // filter by min_lbh on the server side
    const filtered = (data || []).filter((r: any) => {
      const score = r.lbh_scores?.lbh ?? 0;
      return score >= min_lbh;
    });

    return new Response(JSON.stringify({ restaurants: filtered }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
