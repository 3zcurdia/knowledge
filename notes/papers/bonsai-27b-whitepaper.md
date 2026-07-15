# Bonsai 27B Whitepaper

## Abstract
The 27B parameter tier marks a new level of practical intelligence. Models at this scale sustain the behaviors that make language models genuinely useful in production — multi-step reasoning, dependable tool use, and stable agentic workflows — with a reliability that smaller models do not reach. Bonsai 27B is derived from Qwen3.6-27B, a 27B hybrid-attention model whose predominantly linear-attention backbone (~75% linear attention) keeps long-context inference practical. We ship it with a full 262K-token context, enabled on edge devices via a 4-bit KV cache quantizer. The obstacle has never been capability; it is deployment. At roughly 6 bits per weight, conventional low-bit approaches preserve almost all of this capability — but the resulting model is still far too large for the edge. Pushing below 4 to 5 bits with conventional methods causes a qualitative collapse rather than a graceful decline. Bonsai 27B moves the entire Qwen3.6-27B network into a binary or ternary representation that retains that intelligence rather than trading it away. Ternary Bonsai 27B achieves 80.49 average benchmark score (95% of FP16) at 1.71 bits per weight (~5.9 GB). 1-bit Bonsai 27B achieves 76.11 average (90% of FP16) at 1.125 bits per weight (~3.9 GB). The ternary model runs on everyday laptops and the 1-bit model fits on a high-end phone such as the iPhone 17 Pro Max — at ~26 tok/s and ~11 tok/s respectively.

## Findings
Bonsai 27B is a post-training quantization method that converts Qwen3.6-27B into binary ({-1, +1}) or ternary ({-1, 0, +1}) weight representations with group-wise FP16 scaling. Unlike BitNet, which requires pretraining from scratch in the low-bit regime, Bonsai starts from an off-the-shelf pretrained model and preserves its behavior.

Conventional low-bit methods (IQ2_XXS, Q4_K_XL) use mixed-precision schemes that keep sensitive tensors at higher precision. Their advertised labels ("2-bit", "4-bit") are misleading — IQ2_XXS is actually 2.8 bits/weight, Q4_K_XL is 5.2. These methods collapse qualitatively below 4 bits: chain-of-thought reasoning becomes unreliable, tool calls stop parsing, and agentic loops lose coherence, while surface fluency is preserved.

Bonsai achieves true end-to-end low-bit representation. Ternary at 1.71 bpw compresses ~9.4× from FP16. Binary at 1.125 bpw compresses ~14.2×. Both retain reasoning, tool use, and agentic behavior. Ternary retains 94.6% of FP16 average across 15 benchmarks; 1-bit retains 89.5%.

The KV cache is unusually tolerant to quantization in Bonsai models because they are already shaped to tolerate discretization noise. A 4-bit KV cache induces 12–15× less output divergence on-policy and 75–95× less off-policy compared to conventional 4-bit weight builds. This enables 262K-token context on edge devices.

Custom 1-bit and 2-bit kernels were built for the hybrid-attention backbone on Apple MLX (Python, Swift) and CUDA. Token generation is memory-bandwidth-bound, so cutting bytes moved per step yields large speedups. DSpark speculative decoding adds ~1.34–1.37× speedup on CUDA.

At 5.9 GB, Ternary Bonsai 27B outscores IQ2_XXS (72.73 at 9.4 GB) by nearly 8 points at two-thirds the footprint. Conventional methods never reach this regime without quality collapse.

Intelligence density (intelligence per GB) is 2.7× higher than the densest conventional build for 1-bit Bonsai and 2× higher for ternary. On-device energy is an order of magnitude cheaper per token than datacenter GPUs: 0.275 mWh/token on M5 Pro vs 0.63–1.32 mWh/token across GPU classes.

## Numbers

| Metric | Value | Context |
|--------|-------|---------|
| Ternary avg benchmark (15 suite) | 80.49 | 95% of FP16 baseline (85.07) |
| 1-bit avg benchmark (15 suite) | 76.11 | 90% of FP16 baseline |
| FP16 baseline avg | 85.07 | Qwen3.6-27B at 54 GB |
| IQ2_XXS avg | 72.73 | At 9.4 GB, true 2.8 bpw (not 2-bit) |
| Q4_K_XL avg | 84.99 | At 17.6 GB, true 5.2 bpw (not 4-bit) |
| Gemma-4-31B FP16 avg | 84.58 | At 61.5 GB |
| Gemma-4-31B QAT avg | 83.41 | At 23.3 GB, true 6 bpw |
| Gemma-4-31B Q2_K_XL avg | 73.31 | At 11.8 GB, true 3 bpw |
| Ternary weight format | 1.71 bpw | {-1,0,+1} with FP16 group-128 scaling |
| Binary weight format | 1.125 bpw | {-1,+1} with FP16 group-128 scaling |
| Ternary ideal size | 5.9 GB | ~9.4× compression from FP16 |
| Ternary deployed size | 7.2 GB | GGUF; kernels store ternary in 2-bit slots |
| Binary deployed size | 3.9 GB | ~14.2× compression from FP16 |
| FP16 model size | 54 GB | Baseline |
| Ternary compression ratio | ~9.4× | vs FP16 |
| Binary compression ratio | ~14.2× | vs FP16 |
| Context length | 262K tokens | Full-context via hybrid attention backbone |
| Hybrid attention split | ~75% linear / ~25% full | 16 of 64 layers carry full-attention cache |
| KV cache FP16 | ~64 KiB/token | Hybrid backbone caches only 16 of 64 layers |
| KV cache at 262K (FP16) | 17.2 GB | Exceeds weight footprint of both Bonsai variants |
| KV cache at 262K (4-bit) | 4.3 GB | Enables on-device long context |
| KV tolerance (ternary on-policy KL) | 0.0011 | vs FP16 0.0137; ~12× less divergence |
| KV tolerance (ternary off-policy KL) | 0.0029 | vs FP16 0.222; ~76× less divergence |
| KV tolerance (binary on-policy KL) | 0.0009 | vs FP16 0.0137; ~15× less divergence |
| Laptop M5 Max binary TG128 | 66.4 tok/s | At 3.9 GB footprint |
| Laptop M5 Max ternary TG128 | 44.0 tok/s | At 7.2 GB footprint |
| Laptop M5 Pro binary TG128 | 44.2 tok/s | |
| Laptop M5 Pro ternary TG128 | 26.2 tok/s | |
| Laptop M4 Pro binary TG128 | 26.0 tok/s | |
| Laptop M4 Pro ternary TG128 | 18.0 tok/s | |
| iPhone 17 Pro Max binary TG128 | 11.0 tok/s | First 27B model on a phone |
| H100 binary TG128 | 104.8 tok/s | |
| H100 ternary TG128 | 98.0 tok/s | |
| DSpark speedup (ternary) | 1.34× | Accepted length τ=3.7 |
| DSpark speedup (binary) | 1.37× | Accepted length τ=3.6 |
| Intelligence density 1-bit | 0.530/GB | ~2.7× IQ2_XXS (0.199), ~10× FP16 |
| Intelligence density ternary | 0.400/GB | ~2× IQ2_XXS |
| Intelligence density IQ2_XXS | 0.199/GB | |
| Intelligence density Q4_K_XL | 0.155/GB | |
| Peak memory 1-bit 100K ctx | 11.6 GB | GGUF, no KV compression |
| Peak memory ternary 100K ctx | 14.7 GB | GGUF, no KV compression |
| Peak memory 1-bit 262K + 4-bit KV | ~9.4 GB | |
| Peak memory ternary 262K + 4-bit KV | ~12.8 GB | |
| M5 Pro energy (binary decode) | 0.275 mWh/tok | ~10× cheaper than datacenter GPUs |
| H100 energy (binary decode) | 0.905 mWh/tok | |
| iPhone battery efficiency | 672 tok/1% battery | ~67K tokens per full charge |
| iPhone sustained decode | 10.82 tok/s | Over 5.2 min, mild thermal throttle |
| iPhone test run | 3,360 tokens | 5% battery, 5.2 min wall time |
| Math score (FP16→Ternary→1-bit) | 95.33→93.40→91.66 | Within 2 points of FP16 for ternary |
| Coding score (FP16→Ternary→1-bit) | 88.74→85.96→81.88 | |
| Agentic/tool calling (FP16→Ternary→1-bit) | 80.00→74.01→66.03 | Most demanding category |
| IQ2_XXS AIME26 | 57.5 | Selective collapse on reasoning benchmarks |
| IQ2_XXS LiveCodeBench | 56.4 | vs FP16 87.77 |
| Ternary AIME25 | 90.84 | vs IQ2_XXS 58.20 |
| Ternary AIME26 | 87.50 | vs IQ2_XXS 57.50 |
| Ternary LiveCodeBench | 82.75 | vs IQ2_XXS 56.40 |
| DSpark drafter size | ~0.5 GB | 6-layer block-parallel transformer |
| Ternary KV cache at 128K (4-bit) | 2.1 GB | |
| 1-bit peak 4K ctx | 5.2 GB | GGUF |
| Ternary peak 4K ctx | 8.4 GB | GGUF |

## Conclusion
The quality–footprint trade-off is modest and predictable: ternary and binary retain 94.6% and 89.5% of the full-precision average, with the gap concentrated in the most demanding categories (agentic tool use, instruction following, vision). The reasoning core — math and coding — stays within a few points of baseline. Deployments needing the last few points of accuracy can reach for the full-precision model where its footprint is not a constraint.

Long-horizon, tool-driven software engineering (agentic coding) is a demanding capability that this release does not yet target strongly. A Bonsai 27B variant tuned for agentic coding is next on the roadmap.

Today's ternary deployment stores each value in a 2-bit slot, so deployed footprint (~7.2 GB) sits above the information-theoretic minimum (~5.9 GB). Native 1-bit and ternary kernels are an active engineering target and would return the remaining bandwidth and footprint advantage.

The binary and ternary models tolerate KV cache discretization with orders of magnitude more margin than dense or conventional 4-bit builds, pointing to substantial room below 4 bits. Early results show the key cache can be pushed toward the sub-2-bit regime while remaining stable.

The Bonsai methodology is architecture-agnostic and not tied to a single model family. Future work will extend these results to additional backends and further model architectures. On Apple Silicon the batch-1 verification pass for DSpark does not yet amortize; making the drafter net-positive on-device remains an open avenue.

## See also

> Source: inbox/papers/bonsai-27b-whitepaper.md · processed 2026-07-15
