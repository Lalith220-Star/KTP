// Rescore Edge Function — recomputes LBH scores for all restaurants or a single restaurant
// This function should be run with the SUPABASE_SERVICE_ROLE_KEY and can be scheduled daily.

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { computeLBH } from '../_lib/lbh.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

export default async function (req: Request) {
  try {
    const url = new URL(req.url);
    const restaurantId = url.searchParams.get('restaurant_id');

    // fetch list of restaurants
    let restaurants: any[] = [];
    if (restaurantId) {
      const { data } = await supabase.from('restaurants').select('id').eq('id', restaurantId).limit(1);
      restaurants = data || [];
    } else {
      const { data } = await supabase.from('restaurants').select('id');
      restaurants = data || [];
    }

    for (const r of restaurants) {
      const id = r.id;
      // gather signals
      const { data: ratings } = await supabase.from('raw_reviews').select('rating').eq('restaurant_id', id);
      const { data: texts } = await supabase.from('raw_reviews').select('text').eq('restaurant_id', id);
      const { data: hours } = await supabase.from('hours_changes').select('id').eq('restaurant_id', id);
      const { data: jobs } = await supabase.from('job_posts').select('id').eq('restaurant_id', id);

      const ratingVals = (ratings || []).map((r: any) => r.rating).filter(Boolean);
      const textVals = (texts || []).map((t: any) => t.text).filter(Boolean);

      const signals = {
        ratings: ratingVals,
        review_texts: textVals,
        hours_change_count: (hours || []).length,
        job_post_count: (jobs || []).length
      };

      // compute LBH using local scoring module
      // NOTE: Edge Functions run in Deno; importing TS from backend path may need bundling. This is a placeholder showing intent.
      const scores: any = computeLBH(signals as any);

      // upsert into lbh_scores
      const { error } = await supabase.from('lbh_scores').upsert({
        restaurant_id: id,
        lbh: scores.lbh,
        sentiment_score: scores.sentiment_score,
        consistency_score: scores.consistency_score,
        stability_score: scores.stability_score,
        last_scored_at: new Date().toISOString()
      });
      if (error) console.error('Upsert error for', id, error);
    }

    return new Response(JSON.stringify({ status: 'ok', processed: restaurants.length }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
