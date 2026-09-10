# GLM-5.2 vs Claude Opus 4.8: Benchmark Comparison

Head-to-head comparison of GLM-5.2 (open weights, MIT) and Claude Opus 4.8 on a 3D platformer build task and standard benchmarks.

## Build Task Results

| Metric | GLM-5.2 | Opus 4.8 |
|---|---|---|
| Wall-clock time | 1h 10m 40s | **33m 30s** |
| Output tokens | 131,000 | 216,809 |
| Cost | **$5.39** | ~$21.92 |

Opus finished in half the time with a cleaner, more correct game. GLM-5.2 cost a fifth as much.

## Pricing (per 1M tokens)

| | Input | Cache read | Output |
|---|---|---|---|
| Claude Opus 4.8 | $5 | $0.50 | $25 |
| GLM-5.2 | $1.4 | $0.26 | $4.4 |

## Key Benchmarks

| Benchmark | GLM-5.2 | Opus 4.8 |
|---|---|---|
| AIME 2026 | **99.2** | 95.7 |
| SWE-bench Pro | 62.1 | **69.2** |
| NL2Repo | 48.9 | **69.7** |
| HLE (w/ tools) | 54.7 | **57.9** |
| MCP-Atlas | 76.8 | **77.8** |
| Tool-Decathlon | 48.2 | **59.9** |

## Key Difference

GLM-5.2 is text-only (no image input). Opus is multimodal — can read screenshots for self-verification. This mattered for visual tasks where GLM-5.2's self-check missed missing textures and debug overlays.

## Broader Cost Landscape

| Model | Intelligence | Cost/Task | Notes |
|---|---|---|---|
| Fable 5.1 | 66 | $3.69 | Top-tier frontier model |
| Claude Opus 4.8 | ~60 | ~$21.92 (build task) | Multimodal, strongest for visual tasks |
| GLM-5.2 | ~55 | $5.39 (build task) | Text-only, open weights, MIT |
| GLM-5.3 | 60 | $0.49 | 7.5x cheaper than Fable |
| GLM-5.3-Flash (high) | 55 | $0.023 | 160x cheaper than Fable, sufficient for 90% of needs |
| Qwen3.8-27B | 52 | $0.015 | Runnable on existing consumer hardware |

Rule of thumb: 1-point intelligence difference is unlikely noticeable by most, while a 5-point gap is substantial.

## Local Cost Calculation

Cost per task for local models: output tokens per task × decode speed on local hardware × delta energy draw × $0.2049/kWh (US residential average, May 2026) + 15% overhead. Hardware priced at zero — RTX 3090 PCs and 64GB Strix Halo are desirable gaming/work machines anyway.

## Verdict

Use GLM-5.2 when cost and openness matter for text/logic work. Use Opus when correctness, polish, and visual judgment matter. For most tasks, GLM-5.3-Flash at $0.023/task delivers sufficient intelligence at 160× less cost than frontier models. The immense price gap between closed (Anthropic/OpenAI) and open Chinese models means the model is becoming a commodity — the moat moves to the harness, tools, and deployment around it.

> Source: inbox/articles/GLM-5.2 vs Claude Opus.md · processed 2026-07-02
> Merged: captures/observations/llm-intelligence-vs-cost-tradeoffs.md · 2026-09-09
