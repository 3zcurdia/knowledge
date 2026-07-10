# PWA Offline Mode: IndexedDB Queue Over Native Asset Handling

For a lunch-break PWA, a stripped-down offline page is served that stores photos in IndexedDB and queues them for upload when connectivity resumes, since PWAs cannot match native apps' local asset handling.

## The constraint

PWAs run inside a browser sandbox. They do not get the full filesystem access that a native iOS or Android app gets. Trying to make a PWA behave like a native app for offline file handling means fighting the platform.

## What I chose instead

A deliberate two-tier model:

1. **Offline page** — a minimal, cached HTML/CSS/JS shell that renders when the network is unavailable. Not a full app replica; just enough to acknowledge the user, show pending state, and let them queue work.
2. **IndexedDB queue** — every photo the user adds while offline is written to IndexedDB, not to disk directly. A background sync registration (when the browser supports it) or a connectivity-listener flushes the queue once the network returns.

## The trade-off

This pattern accepts that the offline experience is degraded on purpose. The PWA will never feel as fast or as native as a properly installed app. In return, you skip the engineering cost of building a native shell, the App Store review cycle, and the maintenance of two codebases.

For a side project with a single developer, that trade is correct. For a product whose offline UX is the whole value proposition, it is not — go native.

## See also

- [Honesty of Stale Data](../../notes/connections/2026-07-09-honesty-of-stale-data.md)
- [PostGIS Daily Replication Over Live Proxy](postgis-daily-replication-over-live-proxy.md)

> Source: jarvis/01-captures/observations/Offline mode PWA.md · processed 2026-07-09
