# The Honesty of Stale Data

**Type:** A — Same underlying principle in two different domains

Both captures describe the same architectural decision from opposite ends of the stack: choosing to accept a window of stale or queued data rather than paying the continuous cost of real-time synchronization. On the backend, a PostGIS database is replicated daily instead of running live proxy calculations on every request. On the frontend, photos are dumped into IndexedDB and queued for upload instead of demanding native-level local asset handling. The principle is identical — admitting that "eventually consistent" is not a bug but a deliberate, honest trade-off.

## Bridge

Refusing to pretend that real-time is free. Whether the cost is a live spatial query on every map pan or a write to local disk on every photo capture, the cost is real, and the answer is to push the work onto a slower schedule and admit the lag.

## Hook

> The best architecture is not the one that gives users the freshest data. It is the one that honestly admits when "fresh enough" is all you need.

## Why this is not obvious

One note reads like a backend performance optimization, the other like a PWA workaround for limited connectivity. They live in completely different problem spaces. But both are actually about the same thing: refusing to pretend that real-time is free.

## See also

- [PWA Offline Mode: IndexedDB Queue Over Native Asset Handling](../../captures/observations/pwa-offline-mode-indexeddb-queue.md)
- [PostGIS Daily Replication Over Live Proxy](../../captures/observations/postgis-daily-replication-over-live-proxy.md)

> Source: jarvis/02-connections/The Honesty of Stale Data.md · processed 2026-07-09
