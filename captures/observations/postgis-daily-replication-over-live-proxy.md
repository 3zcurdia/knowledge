# PostGIS Daily Replication Over Live Proxy

A nearest-cities endpoint chose daily PostGIS database replication over on-the-fly proxy calculations to avoid repeated computation overhead, accepting a daily sync window for city updates.

## The decision

A "find the N cities nearest to a point" endpoint is the kind of query that can be served two ways:

- **Live proxy** — for every request, compute distances on the fly against a small cities table, sort, return the top N.
- **Pre-computed** — replicate a denormalized view into a second table on a daily cadence and query that.

Live proxy is conceptually cleaner. The pre-computed path is faster at query time but introduces a sync lag and a second source of truth.

## Why pre-computed won

Three reasons, in order of weight:

1. **Query cost compounds.** A live proxy is O(n) per request, where n is the size of the cities table. If the table grows and traffic grows, you pay for both. Daily replication shifts the work to a single batch job that runs once.
2. **Latency budget is small.** The endpoint sits on a map UI that fires on every pan/zoom. Each request has to come back in tens of milliseconds, not hundreds. Pre-computed collapses the read path to an indexed lookup.
3. **Cities don't move.** The data is static enough that a 24-hour lag is invisible to the user. The cost of being wrong about a new city for a day is essentially zero.

The decision is only correct because the dataset is slow-moving. For a "nearest available driver" endpoint, where the answer changes every second, the same trade would be wrong.

## When the trade flips

Pre-computation is the right call when the source data is slow-moving, the query is hot, and a sync lag is invisible. For real-time positioning, live streaming, or any query against state that changes faster than the replication cadence, the math inverts: the sync lag becomes user-visible, and the batch job adds cost without buying anything.

## See also

- [Honesty of Stale Data](../../notes/connections/2026-07-09-honesty-of-stale-data.md)
- [PWA Offline Mode: IndexedDB Queue Over Native Asset Handling](pwa-offline-mode-indexeddb-queue.md)

> Source: jarvis/01-captures/observations/Proxy-Vs-Database.md · processed 2026-07-09
