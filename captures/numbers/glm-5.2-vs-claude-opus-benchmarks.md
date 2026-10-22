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
| Claude Opus 4.8 | ~60 | ~$21.92 (build task) | Multimodal, strongest for visual tasks |
| GLM-5.2 | ~55 | $5.39 (build task) | Text-only, open weights, MIT |

The wider intelligence-versus-cost curve (frontier models, GLM-5.3, GLM-5.3-Flash, Qwen3.8-27B), the rule of thumb for reading intelligence scores, and the break-even calculation for local models are covered in [LLM Intelligence vs Cost Tradeoffs](../observations/llm-intelligence-vs-cost-tradeoffs.md).

## Verdict

Use GLM-5.2 when cost and openness matter for text/logic work. Use Opus when correctness, polish, and visual judgment matter. The immense price gap between closed (Anthropic/OpenAI) and open Chinese models means the model is becoming a commodity — the moat moves to the harness, tools, and deployment around it.

## See also

- [LLM Intelligence vs Cost Tradeoffs](../observations/llm-intelligence-vs-cost-tradeoffs.md)
- [Chinese Open-Weights Models Are Closing the Gap](../observations/chinese-open-weights-llm-industry-trend.md)

> Source: inbox/articles/GLM-5.2 vs Claude Opus.md · processed 2026-07-02
> Merged: captures/observations/llm-intelligence-vs-cost-tradeoffs.md · 2026-09-09
