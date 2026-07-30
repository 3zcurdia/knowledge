# LLM Benchmark Rankings — 5060 Ti 16GB (Vulcan)

Summary of LLM inference benchmarks run on an RTX 5060 Ti 16GB (Vulcan). Models tested at Q4/Q8 quantizations across prompt processing (pp128, pp2048, pp8192) and text generation (tg256) benchmarks.

## Text Generation Speed (tg256)

| Model | VRAM | t/s | t/s per GiB |
|-------|------|-----|-------------|
| Qwen3.5 0.8B Q8 | 774 MiB | 302.05 | 0.39 |
| gemma 4 E2B Q4 K M | 3.19 GiB | 169.92 | 0.053 |
| nanbeige4.1 3b Q4 K M | 2.28 GiB | 151.71 | 0.067 |
| gpt oss 20b MXFP4 | 11.28 GiB | 126.26 | 0.011 |
| gemma 4 E4B Q4 K M | 4.97 GiB | 99.47 | 0.020 |
| Qwen3.5 9B Q4 K M | 5.24 GiB | 68.91 | 0.013 |
| gemma 4 E4B Q8 | 7.48 GiB | 68.84 | 0.009 |
| Bonsai 27B Q1 | 3.54 GiB | 50.69 | 0.014 |
| gemma 4 12B QAT Q4 | 6.50 GiB | 50.68 | 0.008 |
| phi 4 Q4 K M | 8.43 GiB | 44.61 | 0.005 |

## Prompt Processing Speed (pp128)

| Model | VRAM | t/s |
|-------|------|-----|
| Bonsai 27B Q1 | 3.54 GiB | 702.19 |
| gemma 4 12B QAT Q4 | 6.50 GiB | 1693.71 |
| phi 4 Q4 K M | 8.43 GiB | 1244.74 |
| gpt oss 20b MXFP4 | 11.28 GiB | 1797.28 |
| Qwen3.5 9B Q4 K M | 5.24 GiB | 2039.01 |
| gemma 4 E4B Q4 K M | 4.97 GiB | 3391.50 |
| gemma 4 E4B Q8 | 7.48 GiB | 3754.93 |
| nanbeige4.1 3b Q4 K M | 2.28 GiB | 5276.65 |
| gemma 4 E2B Q4 K M | 3.19 GiB | 5704.11 |
| Qwen3.5 0.8B Q8 | 774 MiB | 11711.36 |

## Key Comparisons

- **Bonsai 27B vs Phi 4**: Bonsai (3.54 GiB) is faster in both generation (50.69 vs 44.61 t/s) and prompt processing (702 vs 1245 pp128) while using less than half the VRAM.
- **Gemma 4 E2B vs E4B**: The smaller E2B (3.19 GiB) generates text 71% faster than E4B (4.97 GiB) — 169.92 vs 99.47 t/s.
- **Qwen3.5 9B vs Gemma 4 12B**: Near-identical text generation speed (~69 vs 51 t/s) but Qwen uses less VRAM (5.24 vs 6.50 GiB).

> Source: inbox/agents/llm-benchmarks-5060-ti-16gb-vulcan.csv · processed 2026-07-30
