# LLM Intelligence vs Cost Tradeoffs

ArtificialAnalysis publishes an Intelligence Index (mean of curated benchmarks) and tracks per-model benchmark costs. Their Intelligence vs Cost plot shows the Pareto frontier — the cheapest model achieving each intelligence score. Using expensive models for tasks a cheaper model handles wastes money.

## Critique of AA's Plot

AA's visualization has three shortcomings:

1. **Logarithmic cost axis** — hides the immensity of price differences between cheap and expensive models ($0.015 vs $3.69, a ~250x gap).
2. **Official API pricing** — overstates cost for open-weights models available cheaper via third-party providers like OpenRouter.
3. **Local models at datacenter pricing** — models runnable on consumer hardware appear at datacenter rates no real user would pay.

## Author's Alternative Analysis

The author replots with a linear cost axis, uses OpenRouter cheapest pricing for open-weights models, prices sub-35B-parameter models at local electricity cost, and extrapolates GLM-5.3-Flash at high reasoning effort from AA max-effort scores crossed with Z.ai's coding scores.

Rule of thumb: 1-point intelligence difference is unlikely noticeable by most, while a 5-point gap is substantial. Intelligence score of 50 — rock bottom in the high-intelligence plot — is roughly what the smartest model in the world could deliver in February 2026 (Opus 4.6).

Plots:
- High Intelligence: https://openteams.com/wp-content/uploads/2026/09/high_intelligence-6-scaled.png
- Low Cost: https://openteams.com/wp-content/uploads/2026/09/low_cost-6-scaled.png
- All Models: https://openteams.com/wp-content/uploads/2026/09/all_models-6-scaled.png

## Cost Calculation for Local Models

Cost per task for local models calculated as:

- Output tokens per task from artificialanalysis.ai
- Decode speed (tok/s) on local hardware — mostly RTX 3090 from 2020 (~$1,400 used today)
- Delta between peak and idle energy draw
- Electricity at $0.2049/kWh — US residential weighted average by population, May 2026
- Add 15% for uncached input tokens and waiting for tool calls
- Hardware priced at zero — RTX 3090 PC and 64GB Strix Halo are desirable gaming/work machines anyway

No material electricity cost difference between hardware platforms: Strix Halo draws less than RTX 3090 but is slower, so runs longer for same tasks.

## Larger Local Models

Beyond 64GB RAM, zero hardware cost stops being defensible — almost nobody needs that much RAM except for AI. Qwen3.8-Flash needs minimum 128GB Strix Halo.

| Memory | Hardware | Models |
|---|---|---|
| 128 GB RAM | Strix Halo ($3,600), DGX Spark ($4,300), Mac Studio M5 Max ($5,100), MacBook Pro M5 Max ($7,150) | Qwen3.8-Flash, GLM-5.3-Flash (degraded), DeepSeek-V4-Flash (degraded) |
| 256 GB RAM | 2x DGX Spark ($8,700), Mac Studio M5 Ultra ($11,300) | GLM-5.3-Flash, DeepSeek-V4-Flash |
| 512 GB RAM | 2x Mac Studio M5 Ultra ($22,600) | GLM-5.3 |
| 2 TB RAM | 2x TensTorrent Galaxy Blackhole ($320,000) | Kimi K3 |

## Key Model Comparisons

| Model | Intelligence | Cost/Task | Notes |
|---|---|---|---|
| Fable 5.1 | 66 | $3.69 | Top-tier frontier model |
| GLM-5.3 | 60 | $0.49 | 7.5x cheaper than Fable |
| GLM-5.3-Flash (high) | 55 | $0.023 | 160x cheaper than Fable, sufficient for 90% of needs |
| Qwen3.8-27B | 52 | $0.015 | Runnable on existing consumer hardware |

## Conclusion

Immense cost difference between state-of-the-art Anthropic/OpenAI models and much cheaper Chinese models: former are too expensive even for large corporations, latter as cheap as a mobile subscription. Extra intelligence per dollar obeys diminishing returns — most users won't notice the difference between intelligence 60 and 66.

> Source: inbox/articles/intelligence-vs-cost.md · processed 2026-09-09
