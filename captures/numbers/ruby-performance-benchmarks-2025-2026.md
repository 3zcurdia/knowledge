# Ruby Performance Benchmarks: 2025-2026 PR Roundup

Concrete benchmark numbers from Ruby performance PRs (2025-2026). Every PR below ships a measured improvement.

## Strings & Text

- `String#scrub` ASCII fast path: up to 45.55x faster on English HTML
- `String#codepoints` ASCII hot path: ~1.9x faster on mixed ASCII
- `String#gsub!` no-match optimization: 2.33x faster, allocation drops from 100,041 to 40 bytes

## Files & Directories

- `File.join` common case: up to 18.81x faster for many-string joins
- `File.extname`: up to 6.17x faster on long paths
- `File.expand_path` single-byte fast path: 2.67x faster
- `Dir.scan` yields entry type: 2.12x faster recursive directory walks
- `Dir.pwd` cached: up to 1.33x faster on Linux

## GC & Object Allocation

- Clear page bits in one shot: ~14% off object-new
- Move allocation into gc.c: ~10-15% faster `Object.allocate`
- Remove class alloc check: ~10% faster `Object.new`

## Concurrency

- `TypedData_Get_Struct` fast path: `Mutex#synchronize` ~1.54x faster
- `Thread::Queue` ring buffer: ~23% faster
- Hot thread scheduler priority: 1.455s → 0.231s (2-core)

## BigDecimal

- NTT multiplication: up to 800,000x faster (270 days → 29 seconds)
- `BigDecimal#to_s`: ~2.6x faster small, ~3.8x large

## JIT

- YJIT `RCLASS_EXT_WRITABLE` fix: ~1.5x faster
- ZJIT `getivar` shape-guard failure: 22.5% → 3.0% side exits

> Source: inbox/articles/Small PRs, big speedups the Ruby performance work you almost missed.md · processed 2026-07-02
