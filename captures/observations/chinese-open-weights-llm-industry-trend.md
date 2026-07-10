# Chinese Open-Weights Models Are Closing the Gap

The state of the art in LLMs in 2026 is increasingly being set on the Chinese (and now Japanese) side of the market rather than by US big-tech closed-model labs. Chinese and Japanese companies are shipping open-weight models that you can train before yourself or fine-tune on top of, and that openness has created an arms race where open models are pushing the closed ones.

## What is happening

The closed-model labs in the US still set the headline numbers on most benchmarks. But the leading edge of the open-weights pack is now consistently Chinese:

- **GLM-5.2** (Z.ai) — open weights, MIT license, claims positions just behind the top closed models on most reasoning and coding benchmarks at a fraction of the cost.
- **Qwen 3.7 Max** — Qwen started as a small Chinese-only model and has grown into a generally useful frontier-tier model for complex work, with releases that match or beat Kimi 2.6 in some tasks.
- **Kimi 2.6** (Moonshot AI) — a reference point in the open-weights tier; Qwen 3.7 Max is now exceeding it on a project I am running.
- **DeepSeek** — established itself as a serious open-weights contender at the reasoning-tier.

The pattern is consistent: the Chinese labs ship open weights, the open weights push the closed labs, the closed labs respond with the next closed generation, and the cycle repeats. It is an arms race where the open side is no longer behind.

## Why it matters

Three downstream effects:

1. **Pricing pressure.** The closed labs can no longer price as if the only alternative is the previous closed generation. Open weights at a fraction of the cost create a real ceiling on what closed labs can charge, even for the best work.
2. **Local deployment becomes viable for serious work.** A frontier-adjacent model you can download and run on your own machine is qualitatively different from a frontier-adjacent model you have to call through an API. The former creates new categories of product (offline agents, air-gapped workflows, on-device assistants) that the latter cannot.
3. **The strategic moat shifts.** When the leading open model is a download away from anyone, the moat moves from "we have the best model" to "we have the best workflow around the model" — the harness, the tools, the skills, the data, the deployment, the taste.

## What to do about it

For practitioners, the right read is: do not pick a side yet. Treat the closed-vs-open question as a moving target. Run the same task against the top closed and the top open model on a recurring cadence, and switch the default whenever the gap narrows below the threshold that matters for your use case. The threshold is different for a coding agent (where the closed lead is still real on hard multi-file tasks) than for a translation or extraction job (where the open models are already good enough).

For builders, the read is more structural: build the harness, the skills, the data layer, and the product surface so that the model is a swappable component. The companies that win the next two years will be the ones that noticed the model is becoming a commodity and stopped building moats on top of it.

## See also

- [GLM-5.2 vs Claude Opus 4.8: Benchmark Comparison](../numbers/glm-5.2-vs-claude-opus-benchmarks.md)
- [Top Use Cases for Local LLMs](../../notes/top-use-cases-for-local-llms.md)
- [Local AI as Default: On-Device Processing Over Cloud APIs](local-ai-default-architecture.md)

> Source: jarvis/01-captures/reactions/LLM State of the Art.md · processed 2026-07-09
