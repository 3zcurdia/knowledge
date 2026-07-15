# BitNet 1-bit LLM Architecture and Quantization-Aware Training

BitNet is a 1-bit LLM architecture from Microsoft that uses ternary weights {-1, 0, +1}, requiring 1.58 bits per weight. It matches full-precision Transformer LLMs in perplexity and end-task performance while being significantly more cost-effective in latency, memory, throughput, and energy.

## Architecture

BitNet looks like any modern LLM — a stack of transformer blocks. The key innovation is replacing each standard linear layer (`nn.Linear`) with a custom `BitLinear` layer. Within BitLinear:
- Activations are quantized to 8-bit integers
- Weights are ternary (-1, 0, +1)
- Everything outside the BitLinear box works in full precision (attention computation, token embeddings, etc.)

A layer norm is inserted before quantizing activations to shift mean to zero and variance to one, making quantization resilient to outliers.

## Quantization-Aware Training (QAT)

One-bit LLMs require QAT to be viable. During training:
1. A full-precision master copy of weights is maintained for gradient computation
2. Before the forward pass, weights are quantized on the fly (fake/simulated quantization)
3. The forward pass operates on ternary weights, as it will during inference
4. The **straight-through estimator (STE)** sets the derivative of rounding to 1, enabling gradient-based optimization despite non-differentiable operations

Meta recommends splitting training into 90% full-precision pre-training and 10% QAT fine-tuning.

## Bitpacking and ELUT

Hardware doesn't natively support 2-bit data types. Solutions:
- **Naive approach**: Store each 2-bit weight in a separate uint8 (wasteful)
- **Bit packing**: Pack four 2-bit weights into a single uint8
- **ELUT (Element-wise Lookup Table)**: Group weights (e.g., 3 values → 27 combinations → 5 bits, achieving 1.67 bits/weight). BitNet uses TL2 (3 weights in 5 bits) and TL1 (2 weights in 4 bits)

## Performance

BitNet achieves:
- 9x faster inference on GPUs, 6x faster on CPUs vs full-precision models of same parameter count
- At 3B parameters, matches FP16 LLaMA in perplexity with 2.71x speedup and 3.55x less memory
- Scaling laws hold for low-bit models — larger models continue to improve

The 2B parameter open-source model is competitive with similar-size FP models (Llama 3.2, Gemma 3), trailing Qwen 2.5 slightly.

## See also

- [Quantization Fundamentals for LLMs](quantization-fundamentals-llms.md)
- [BitNet b1.58: 1.58-bit Ternary LLM Performance and Scaling](../numbers/bitnet-b158-performance-scaling.md)

> Source: inbox/articles/1-bit-quantization.md · processed 2026-07-14