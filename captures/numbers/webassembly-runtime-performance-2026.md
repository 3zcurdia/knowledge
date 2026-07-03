# WebAssembly Runtime Performance Benchmarks 2026

Benchmark of libsodium compiled to WebAssembly across 9 runtimes (Bun, Node, WAMR, wasm2c, WasmEdge, Wasmer, Wasmtime, WAVM, Wazero) using 2024–2026 releases. Host: AMD Ryzen AI 9 HX 470, Linux 7.1.0-rc7, Zig 0.17.0-dev. Numbers are geometric mean of per-benchmark slowdowns relative to native (lower is better).

## Runtime Versions Tested

| Runtime | 2024 | 2025 | 2026 |
| --- | --- | --- | --- |
| Bun | 1.1.16 | 1.2.17 | 1.3.14 |
| Node | 22.3.0 | 24.2.0 | 26.3.1 |
| WAMR | 2.1.0 | 2.3.1 | 2.4.4 |
| WABT wasm2c | 1.0.35 | 1.0.37 | 1.0.41 |
| WasmEdge | 0.14.0 | 0.14.1 | 0.17.0 |
| Wasmer | 4.3.2 | 6.0.1 | 7.1.0 |
| Wasmtime | 22.0.0 | 34.0.0 | 46.0.0 |
| WAVM | n/a | n/a | nightly/2026-04-05 |
| Wazero | 1.7.3 | 1.9.0 | 1.12.0 |

## Key Findings

- **Wasmer 7.1.0** is the best performer with `wide_arithmetic`: **1.33x native**
- **Wasmtime** improved steadily every year: 2.67x (2024) → 2.54x (2025) → 2.41x (2026) baseline
- **Bun** made a huge jump: ~3x faster from 2025 to 2026, though still slower than Node on this workload
- **WAMR** in AOT mode: ~1.57x native (fast and stable)
- **wasm2c** remains excellent if AOT translation to native C is acceptable
- **WAVM** produced the fastest 2026 baseline number, but no fair historical comparison available
- **WasmEdge** remains excellent once forced into AOT mode (`--run-mode=aot`)

## wide_arithmetic Impact

The biggest speedup in the experiment. Only Wasmtime and Wasmer could run the full `wide_arithmetic` build among stable releases tested:

- **Wasmtime 46.0.0**: 2.41x native → **1.46x native** with wide_arithmetic
- **Wasmer 7.1.0**: 2.08x native → **1.33x native** with wide_arithmetic

`lime1` and `simd128` alone are not magic — sometimes they help, sometimes they hurt, and sometimes the difference is lost in noise.

## Baseline WebAssembly (no SIMD, no wide_arithmetic)

| Runtime | 2024 | 2025 | 2026 |
| --- | --- | --- | --- |
| Wasmtime | 2.67x | 2.54x | 2.41x |
| Node | 8.60x | — | 7.95x |
| Wazero | 4.84x | 4.70x | 4.72x |
| WAMR (AOT) | — | 1.59x | 1.57x |
| Wasmer | — | — | ~baseline |
| Bun | far behind | far behind | ~3x faster than 2025 |
| WasmEdge | — | — | 1.74x (with AOT flag) |

## Takeaways

- Runtime choice matters a lot for CPU-heavy WebAssembly: fastest (Wasmer+wide_arithmetic 1.33x) vs slowest (Bun baseline 8.77x) is a 6.6x spread
- Feature support matters: the same runtime can move from "pretty good" to "surprisingly close to native" with better arithmetic instructions
- Mainstream runtimes are not standing still — Wasmtime improved steadily, Bun made a huge jump, Wasmer gained a key feature
- Benchmark your actual workload

> Source: inbox/articles/Performance of WebAssembly runtimes in 2026.md · processed 2026-07-02
