# Solana Validator Indexer

This service backfills and continually updates validator stake and rewards into MongoDB,
and computes APY for delegators.

## Features
- Historical backfill (from genesis epoch → current)
- Incremental updates (polls new epochs on a schedule)
- MongoDB time‑series storage of stakes & rewards
- APY aggregation scripts