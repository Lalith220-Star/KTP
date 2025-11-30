import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { computeLBH } from '../_lib/lbh.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

export default async function (req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });

    const { data: restaurant, error: rerr } = await supabase.from('restaurants').select('*').eq('id', id).single();
    if (rerr || !restaurant) return new Response(JSON.stringify({ error: 'not found' }), { status: 404 });

    const { data: reviews } = await supabase.from('raw_reviews').select('author,rating,text,created_at').eq('restaurant_id', id).order('created_at', { ascending: false }).limit(20);
    const { data: lbh } = await supabase.from('lbh_scores').select('*').eq('restaurant_id', id).single();

    // if lbh missing, compute on-the-fly using basic signals
    let lbh_payload = lbh;
    if (!lbh_payload) {
      const ratingVals = (reviews || []).map((r: any) => r.rating).filter(Boolean);
      const textVals = (reviews || []).map((r: any) => r.text).filter(Boolean);
      lbh_payload = computeLBH({ ratings: ratingVals, review_texts: textVals, hours_change_count: 0, job_post_count: 0 });
    }

    return new Response(JSON.stringify({ restaurant, reviews, lbh: lbh_payload }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
