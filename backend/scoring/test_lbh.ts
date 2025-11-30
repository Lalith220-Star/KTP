import { computeLBH } from './lbh';

function assertApproximately(actual: number, expected: number, tol = 0.5) {
  if (Math.abs(actual - expected) > tol) {
    throw new Error(`Assertion failed: expected ~${expected}, got ${actual}`);
  }
}

function run() {
  console.log('Running LBH scoring tests...');

  const sample1 = computeLBH({ ratings: [5, 4, 4, 3, 5], review_texts: ['Great food', 'Slow service'], hours_change_count: 1, job_post_count: 2 });
  console.log('sample1', sample1);
  // Check bounds and expected approximate values
  assertApproximately(sample1.sentiment_score, 80, 30); // wide tolerance for simple heuristic
  assertApproximately(sample1.lbh, (sample1.sentiment_score * 0.5) + (sample1.consistency_score * 0.25) + (sample1.stability_score * 0.25));

  const sample2 = computeLBH({ ratings: [], review_texts: [], hours_change_count: 10, job_post_count: 20 });
  console.log('sample2', sample2);
  // low scores expected
  if (sample2.lbh > 60) throw new Error('Expected low LBH for many changes/posts');

  console.log('All LBH tests passed.');
}

run();
