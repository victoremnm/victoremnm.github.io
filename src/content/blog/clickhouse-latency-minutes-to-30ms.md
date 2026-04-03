---
title: "From Minutes to 30ms: Redesigning a Real-Time Trading Data Pipeline"
description: "A post-mortem on the architectural decisions that dropped query latency by 99% on a crypto trading platform processing 400+ trades per second."
date: 2026-04-02
tags: ["data-engineering", "clickhouse", "real-time", "performance"]
draft: false
---

Last quarter I spent several weeks redesigning the data pipeline for a real-time crypto trading platform. The before state: analysts waiting minutes for queries to return. The after state: <30ms on the same queries. This is a walkthrough of what changed and why.

## The Before State

The platform processes 400+ trades per second across thousands of tokens. The original pipeline looked roughly like this:

1. Trades land in Postgres via the transaction processor
2. A CDC job (Debezium) streams changes downstream
3. ClickHouse receives raw events
4. Queries run against the raw event tables

The problem was query shape. Analysts and the trading app itself were asking questions like:

- "What's the current holder count for this token?"
- "What's the 24h volume-weighted average price?"
- "Who are the top holders, and what's their combined position size?"

These are aggregation-heavy, and running them against a raw event table at query time means scanning millions of rows. At 400+ trades/second, that table grows fast. Queries that were fine at launch became slow within weeks.

## The Diagnosis

Three things were compounding the problem:

**1. No materialized aggregations.** Every query was computing from scratch. ClickHouse is fast at this, but not infinitely fast — especially with complex JOINs across holder state and trade history.

**2. The schema wasn't designed for the read pattern.** The raw trade table was optimized for writes (event append), not for the "what's the current state of token X" reads the app actually needed.

**3. Holder state was computed, not stored.** Every time you needed to know current holder distribution, you had to replay the entire trade history for that token. There was no snapshot of current state.

## The Redesign

### Materialized Views for Hot Aggregations

The first change was introducing ClickHouse materialized views that maintain running aggregations as data lands. Instead of computing holder counts at query time, we update them on insert:

```sql
CREATE MATERIALIZED VIEW holder_stats_mv
ENGINE = AggregatingMergeTree()
ORDER BY (token_mint, snapshot_date)
AS SELECT
    token_mint,
    toDate(block_time) AS snapshot_date,
    uniqState(holder_address) AS unique_holders,
    sumState(token_amount) AS total_supply_held,
    countState() AS trade_count
FROM trades
GROUP BY token_mint, snapshot_date;
```

The `AggregatingMergeTree` engine is the key piece here — it merges partial aggregation states in the background, so queries use `uniqMerge()` / `sumMerge()` against pre-computed state rather than scanning raw events.

### Holder State as a First-Class Table

The bigger lift was treating holder state as something that gets maintained, not computed. We introduced a `holder_state` table that's updated via the block processor:

- On each trade, we upsert the holder's balance for that token
- We store the delta (trade amount) and the running total
- Snapshots are taken daily so historical queries don't need to replay

The key design decision was choosing `ReplacingMergeTree` with a version column (block height). ClickHouse will deduplicate rows with the same key, keeping the highest version — which maps cleanly to "latest state wins."

### The Enrichment Layer

Raw trades don't have holder context when they land. We added an enrichment step in the streaming processor that:

1. Reads the trade event from a pub/sub message bus
2. Looks up current holder state from a local cache (Redis-backed)
3. Writes the enriched trade (with holder context, rank, position size) to ClickHouse

This moved compute out of the query path and into the write path, which is the right trade-off for a read-heavy analytics workload.

### Dropping a Legacy View

One of the more important cleanup steps was dropping `agg_holders_mv`, a legacy materialized view that was double-counting holders in certain edge cases (wallets that trade in and out within the same block). Identifying it required tracing query results against raw event data manually. The fix was straightforward once found, but the debugging took longer than the fix itself — a reminder that materialized view bugs are silent until they're not.

## The Results

After rolling out:

- **Query latency**: minutes → <30ms for holder queries
- **Dashboard load time**: 15–20s → <1s on the trading app
- **Write throughput**: unchanged — enrichment adds ~2ms of latency to the write path, negligible at our scale

## What I'd Do Differently

**Define the read patterns before the schema.** We designed the write schema first and retrofitted reads onto it. Starting with "what are the 5 queries this system needs to answer fast" would have gotten us to materialized views much sooner.

**Watch for view dependencies.** ClickHouse materialized views are not automatically updated when the source table schema changes. We hit this once when adding a column to `trades` — the view started silently dropping the new column. You need explicit DDL migration discipline.

**Separate hot and cold aggregations.** Some queries (live price, current holders) need sub-10ms. Others (historical holder distribution, 30d volume trend) can tolerate seconds. Treating them the same in the schema is wasteful — the hot queries need in-memory-accessible materialized state; the cold ones can afford a background merge.

The full pipeline (Postgres → pub/sub bus → enrichment → ClickHouse → materialized views) now runs with consistent sub-30ms p99 on analytics queries. The architecture is less clever than I initially planned — which is exactly right.
