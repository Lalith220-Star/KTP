// Deno-compatible LBH helper used by Edge Functions
export function computeLBH(signals: {
  ratings?: number[];
  review_texts?: string[];
  hours_change_count?: number;
  job_post_count?: number;
}) {
  const ratings = signals.ratings || [];
  function normalizeRatingAvg(ratings: number[]): number {
    if (!ratings || ratings.length === 0) return 50;
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    return ((avg - 1) / 4) * 100;
  }

  const POSITIVE_WORDS = ['good','great','excellent','amazing','delicious','friendly','fast'];
  const NEGATIVE_WORDS = ['bad','terrible','slow','rude','awful','cold','stale'];

  function textSentimentScore(texts?: string[]): number {
    if (!texts || texts.length === 0) return 50;
    let score = 0;
    let count = 0;
    for (const t of texts) {
      const s = t.toLowerCase();
      let local = 0;
      for (const p of POSITIVE_WORDS) if (s.includes(p)) local += 1;
      for (const n of NEGATIVE_WORDS) if (s.includes(n)) local -= 1;
      score += Math.max(-3, Math.min(3, local));
      count += 1;
    }
    const avg = score / count;
    return Math.max(0, Math.min(100, (avg + 3) / 6 * 100));
  }

  const ratingScore = normalizeRatingAvg(ratings);
  const textScore = textSentimentScore(signals.review_texts);
  const sentiment = (ratingScore * 0.7) + (textScore * 0.3);

  const changes = signals.hours_change_count || 0;
  const consistency = Math.max(0, 100 - (changes / 10) * 100);

  const jobs = signals.job_post_count || 0;
  const stability = Math.max(0, 100 - (jobs / 20) * 100);

  const lbh = (sentiment * 0.5) + (consistency * 0.25) + (stability * 0.25);

  return {
    lbh: Number(lbh.toFixed(2)),
    sentiment_score: Number(sentiment.toFixed(2)),
    consistency_score: Number(consistency.toFixed(2)),
    stability_score: Number(stability.toFixed(2))
  };
}
