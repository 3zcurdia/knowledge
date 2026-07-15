# BitNet b1.58: 1.58-bit Ternary LLM Performance and Scaling

BitNet b1.58 is a 1-bit LLM variant where every parameter is ternary {-1, 0, 1}, achieving 1.58 bits per weight. It matches full-precision (FP16/BF16) Transformer LLMs in perplexity and end-task performance starting from 3B parameters, while delivering significant cost reductions in latency, memory, throughput, and energy.

## Quantization Function

Weights are constrained to {-1, 0, +1} using absmean quantization:

```
f = RoundClip(W / (γ + ε), -1, 1)
RoundClip(x, a, b) = max(a, min(b, round(x)))
γ = (1/nm) Σ|W_ij|
```

Activations are scaled to [-Qb, Qb] per token, eliminating zero-point quantization.

## Performance Results

| Model | Size | Memory (GB) | Latency (ms) | PPL |
|-------|------|-------------|--------------|-----|
| LLaMA LLM | 3B | 7.89 (1.00x) | 5.07 (1.00x) | 10.04 |
| BitNet b1.58 | 3B | 2.22 (3.55x↓) | 1.87 (2.71x↓) | 9.91 |
| BitNet b1.58 | 3.9B | 2.38 (3.32x↓) | 2.11 (2.40x↓) | 9.62 |

At 70B parameters: BitNet b1.58 is **4.1x faster** than LLaMA LLM baseline.

Throughput at 70B on two 80GB A100s: BitNet supports **11x larger batch size**, yielding **8.9x higher throughput** (2977 tokens/s vs 333 tokens/s).

## Energy Efficiency

On 7nm chips, BitNet b1.58 saves **71.4x** arithmetic operations energy consumption for matrix multiplication. As model size scales, BitNet becomes increasingly more efficient because the percentage of nn.Linear grows with model size.

## New Scaling Law

1.58-bit LLMs establish a new cost-performance equivalence:
- **13B BitNet b1.58** ≈ more efficient than **3B FP16** (latency, memory, energy)
- **30B BitNet b1.58** ≈ more efficient than **7B FP16**
- **70B BitNet b1.58** ≈ more efficient than **13B FP16**

## Training and Evaluation

Models pre-trained on RedPajama for 100B tokens. Evaluated on ARC-Easy, ARC-Challenge, HellaSwag, Winogrande, PIQA, OpenbookQA, BoolQ. With 2T tokens, BitNet b1.58 3B outperforms StableLM-3B on all end tasks (Winogrande 66.37 vs 64.56, PIQA 78.40 vs 76.93, LAMBADA 67.63 vs 66.09).

## Future Directions

- 1-bit Mixture-of-Experts (MoE): reduced memory enables single-chip deployment
- Native long sequence support: 8-bit activations double context length with same resources
- Edge and mobile deployment: friendly to CPU devices
- New hardware optimized for 1-bit computation paradigm

## See also

- [Quantization Fundamentals for LLMs](../patterns/quantization-fundamentals-llms.md)
- [BitNet 1-bit LLM Architecture and Quantization-Aware Training](../patterns/bitnet-1bit-llm-architecture.md)

> Source: inbox/papers/2402.17764v1.md · processed 2026-07-14