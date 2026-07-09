# Why BEAM (Elixir) outperforms MRI (Ruby) on path tracing

Both the Ruby (`raytrace-ruby`) and Elixir (`exray`) implementations are direct
ports of the path tracer from *Ray Tracing in One Weekend* (Shirley). On the
same random-sphere scene:

- Ruby (`ruby main.rb`): 6421.98s user, 99% CPU, **1:47:36.91 total**
- Elixir (`mix run render.exs`): 2562.20s user, 103% CPU, **42:38.08 total**

That is roughly a **2.5x speedup in user CPU** and **2.4x in wall time** with
**no algorithmic optimization** in the Elixir codebase. The gap is entirely a
runtime characteristic story.

## Why the gap exists

Path tracing is a worst-case-friendly workload for the kind of code each
runtime is slow at. It is roughly 99% floating-point arithmetic plus constant
small-object churn (vectors, colors, hit records, ray structs) per pixel, per
sample, per bounce. The runtime differences that matter:

- **Float arithmetic.** BEAM does float math on native tagged immediates with
  fast paths for the common scalar operations (add, multiply, sqrt, dot
  product). MRI/CRuby boxes floats in heap-allocated `RFloat` objects and
  dispatches every operation through a generic numeric path.
- **Small-struct allocation.** The hot loop allocates a fresh `%Vector{}`,
  `%Color{}`, `%Ray{}`, and `%HitRecord{}` on every bounce. BEAM's allocator
  handles many small, short-lived terms cheaply; MRI pays full object-allocation
  and GC-tracking cost for each one.
- **Random number generation.** BEAM exposes `:rand.uniform/0` as a C BIF — a
  single native call per sample. The Ruby version typically goes through more
  Ruby-level code on every call.
- **Closest-hit early exit.** Both implementations use a `reduce_while`-style
  loop that prunes with the closest-so-far `t_max` so a sphere behind a nearer
  hit is never tested. This is just the standard algorithm, not an
  optimization, but it shows up identically in both.
- **GC and scheduling overhead.** The Elixir run shows 103% CPU (vs Ruby's
  99%), which is BEAM's GC + scheduler, not real parallelism — the render loop
  is fully sequential.

## What is *not* the reason

- No BVH, no spatial acceleration, no SIMD, no NIFs.
- No `Task.async_stream` over scanlines or pixels.
- No compile-time specialization of the inner loop.
- No persistent data structure tricks.

The Elixir and Ruby ports are algorithmically identical. If you ported the same
code to Python/CPython you would see a similar gap for the same reasons; the
underlying workload is dominated by float math and small-allocation churn, and
BEAM is materially better at that profile than MRI.

## What would actually move the needle

Both implementations are O(objects x pixels x samples x depth) and equally
naive. The two real levers for a much larger speedup are:

- A **BVH (bounding-volume hierarchy)** over the spheres, turning the per-ray
  work from O(N) to ~O(log N).
- **`Task.async_stream`** over scanlines or pixel blocks, exploiting BEAM's
  preemptive scheduler for multi-core parallelism.

## See also

- [Bounding Volume Hierarchy (BVH) for ray tracing](../concepts/bounding-volume-hierarchy-raytracing.md)
- *Ray Tracing in One Weekend* — Peter Shirley (the algorithm being ported)

> Source: inbox/chats/session-ses_0b6d.md · processed 2026-07-09
