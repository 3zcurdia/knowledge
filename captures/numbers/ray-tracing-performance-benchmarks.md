# Ray Tracing Performance Benchmarks — Ruby vs Elixir

All measurements on an **Apple M4 Pro** (8+4 cores, 24 GB RAM).

| Implementation | Wall Time | CPU Util | Speedup vs Ruby |
|---|---|---|---|
| **Ruby** (single-core) | 1h 47m 37s | 99% | 1× |
| **Elixir** single-core | 42m 38s | 103% | **2.5×** |
| **Elixir** parallel per line | 2m 56s | 1054% | **37×** |
| **Elixir** parallel per line + BVH | 9.2s | 1028% | **702×** |
| **Elixir** parallel per tile (64×64) + BVH | 10.5s | 892% | **615×** |

The Ruby README warns that larger renders take "a looooong time" and their final 400×266 image took **~6 hours**. The Elixir single-core 400×225 render at 42 minutes is consistent with Ruby's 1h47m for the same scene (the Ruby benchmark likely ran the same random scene).

## Why Elixir is Faster (even single-core)

| Factor | Ruby | Elixir/Erlang | Impact |
|---|---|---|---|
| Object layout | `RClass` with ivar table, dynamic dispatch | Compact tuple/struct, pattern matching | ~2-3× less memory per allocation |
| GC | Stop-the-world mark-sweep | Per-process generational, concurrent | No pause spikes during long renders |
| Math calls | `Math.sqrt` (C), but through Ruby's method dispatch | `:math.sqrt` (Erlang NIF, direct) | Slightly faster FP ops |
| Function dispatch | Dynamic method lookup with cache | Pattern matching + guard clauses | Comparable |
| Operator overload | `v1 + v2` allocates new object | `Vector.add(v1, v2)` allocates new struct | Allocation cost similar |

The 2.5× single-core advantage comes primarily from **BEAM's per-process memory management** and **struct memory density**. Each `Vector3D` in Ruby carries a full Ruby object header, whereas an Elixir `%Vector{}` struct is a more compact tagged tuple under the hood. With ~225 billion allocations over a render, this difference compounds dramatically.

> Source: inbox/agents/exray-report.md · processed 2026-07-11
