# LLM Benchmarks — 5060 Ti 16GB (Vulcan)

Complete benchmark results for 10 LLM models on an RTX 5060 Ti 16GB. All models at Q4/Q8 quantization. Tests: prompt processing (pp128, pp2048, pp8192) and text generation (tg256).

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
| Qwen3.5 0.8B Q8 | 774 MiB | 11711.36 |
| gemma 4 E2B Q4 K M | 3.19 GiB | 5704.11 |
| nanbeige4.1 3b Q4 K M | 2.28 GiB | 5276.65 |
| gemma 4 E4B Q8 | 7.48 GiB | 3754.93 |
| gemma 4 E4B Q4 K M | 4.97 GiB | 3391.50 |
| Qwen3.5 9B Q4 K M | 5.24 GiB | 2039.01 |
| gpt oss 20b MXFP4 | 11.28 GiB | 1797.28 |
| gemma 4 12B QAT Q4 | 6.50 GiB | 1693.71 |
| phi 4 Q4 K M | 8.43 GiB | 1244.74 |
| Bonsai 27B Q1 | 3.54 GiB | 702.19 |

## Key Comparisons

- **Bonsai 27B vs Phi 4**: Bonsai (3.54 GiB) is faster in both generation (50.69 vs 44.61 t/s) and prompt processing (702 vs 1245 pp128) while using less than half the VRAM.
- **Gemma 4 E2B vs E4B**: The smaller E2B (3.19 GiB) generates text 71% faster than E4B (4.97 GiB) — 169.92 vs 99.47 t/s.
- **Qwen3.5 9B vs Gemma 4 12B**: Near-identical text generation speed (~69 vs 51 t/s) but Qwen uses less VRAM (5.24 vs 6.50 GiB).

## All Raw Results

| Model | Size | Test | t/s |
|-------|------|------|-----|
| nanbeige4.1 3b q4 k m | 2.28 GiB | pp128 | 5276.65 |
| nanbeige4.1 3b q4 k m | 2.28 GiB | pp2048 | 6029.87 |
| nanbeige4.1 3b q4 k m | 2.28 GiB | pp8192 | 5264.37 |
| nanbeige4.1 3b q4 k m | 2.28 GiB | tg256 | 151.71 |
| Qwen3.5 9B Q4 K M | 5.24 GiB | pp128 | 2039.01 |
| Qwen3.5 9B Q4 K M | 5.24 GiB | pp2048 | 2813.33 |
| Qwen3.5 9B Q4 K M | 5.24 GiB | pp8192 | 2747.11 |
| Qwen3.5 9B Q4 K M | 5.24 GiB | tg256 | 68.91 |
| gemma 4 12B it QAT Q4 0 | 6.50 GiB | pp128 | 1693.71 |
| gemma 4 12B it QAT Q4 0 | 6.50 GiB | pp2048 | 2011.89 |
| gemma 4 12B it QAT Q4 0 | 6.50 GiB | pp8192 | 1872.73 |
| gemma 4 12B it QAT Q4 0 | 6.50 GiB | tg256 | 50.68 |
| gemma 4 E2B it Q4 K M | 3.19 GiB | pp128 | 5704.11 |
| gemma 4 E2B it Q4 K M | 3.19 GiB | pp2048 | 8538.09 |
| gemma 4 E2B it Q4 K M | 3.19 GiB | pp8192 | 7685.91 |
| gemma 4 E2B it Q4 K M | 3.19 GiB | tg256 | 169.92 |
| gemma 4 E4B it Q4 K M | 4.97 GiB | pp128 | 3391.50 |
| gemma 4 E4B it Q4 K M | 4.97 GiB | pp2048 | 4352.96 |
| gemma 4 E4B it Q4 K M | 4.97 GiB | pp8192 | 3955.64 |
| gemma 4 E4B it Q4 K M | 4.97 GiB | tg256 | 99.47 |
| gemma 4 E4B it Q8 0 | 7.48 GiB | pp128 | 3754.93 |
| gemma 4 E4B it Q8 0 | 7.48 GiB | pp2048 | 4638.11 |
| gemma 4 E4B it Q8 0 | 7.48 GiB | pp8192 | 4328.28 |
| gemma 4 E4B it Q8 0 | 7.48 GiB | tg256 | 68.84 |
| gpt oss 20b MXFP4 | 11.28 GiB | pp128 | 1797.28 |
| gpt oss 20b MXFP4 | 11.28 GiB | pp2048 | 3645.86 |
| gpt oss 20b MXFP4 | 11.28 GiB | pp8192 | 3510.11 |
| gpt oss 20b MXFP4 | 11.28 GiB | tg256 | 126.26 |
| phi 4 Q4 K M | 8.43 GiB | pp128 | 1244.74 |
| phi 4 Q4 K M | 8.43 GiB | pp2048 | 1680.73 |
| phi 4 Q4 K M | 8.43 GiB | pp8192 | 1535.43 |
| phi 4 Q4 K M | 8.43 GiB | tg256 | 44.61 |
| Bonsai 27B Q1 0 | 3.54 GiB | pp128 | 702.19 |
| Bonsai 27B Q1 0 | 3.54 GiB | pp2048 | 850.21 |
| Bonsai 27B Q1 0 | 3.54 GiB | pp8192 | 830.45 |
| Bonsai 27B Q1 0 | 3.54 GiB | tg256 | 50.69 |
| Qwen3.5 0.8B Q8 0 | 774.23 MiB | pp128 | 11711.36 |
| Qwen3.5 0.8B Q8 0 | 774.23 MiB | pp2048 | 17752.63 |
| Qwen3.5 0.8B Q8 0 | 774.23 MiB | pp8192 | 15622.33 |
| Qwen3.5 0.8B Q8 0 | 774.23 MiB | tg256 | 302.05 |

> Source: inbox/agents/llm-benchmarks-5060-ti-16gb-vulcan.csv · processed 2026-07-30
> Merged: captures/numbers/llm-benchmarks-5060-ti-vulcan.md · 2026-09-09
