LBH scoring engine (TypeScript)

This folder contains a simple TypeScript scoring module that computes the Local Business Health (LBH) score and component breakdowns: sentiment, consistency, stability.

The initial implementation uses lightweight heuristics:
- Sentiment: average normalized rating + simple sentiment from review text (polarity lexicon)
- Consistency: count of listing/hours changes in a window (fewer changes => higher score)
- Stability: job posting frequency over a recent window (fewer posts => higher score)

The module exports a function `computeLBH(signals)` that returns `{ lbh, sentiment_score, consistency_score, stability_score }`.

The scoring is intentionally simple and documented for future replacement by ML models.
