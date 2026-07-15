# Quantization Fundamentals for LLMs

Quantization is the process of mapping a continuous space to a discrete one. In machine learning, it converts model weights and activations from real values (floating point) to integers, enabling smaller models, less memory usage, and faster inference at the cost of some precision.

## Why Quantize

Modern LLMs are massive — DeepSeek R1 has 671 billion parameters, consuming ~720 GB in FP16. Quantization can shrink this footprint by over 80% down to ~131 GB, fitting across two Nvidia H100 GPUs. It also enables deployment on edge devices like Google Coral Edge TPU that don't support floating-point operations.

Integer operations are fundamentally more efficient: adding two integers is a trivial bitwise XOR with carryover, completing in a single clock cycle on modern CPUs. Floating-point addition requires aligning exponents, adding significands, and normalizing — taking 3-4 clock cycles.

## When to Quantize

Two major milestones exist in a model's lifetime: training and inference.

- **Training** historically used FP32, now mostly FP16/BFloat16. Recent LLMs (DeepSeek R1, Llama 4) train in FP8, though the mechanics are not well understood publicly.
- **Inference** (forward pass only) is more resilient to precision loss. People have successfully run inference at 8-bit, 4-bit, or even 1-bit precision.

Key approaches:
- **Post-training quantization (PTQ)**: Quantize after training, before deployment. Most open-weight LLMs use this — Meta/DeepSeek publish FP models, communities quantize them (suffixes like GGUF, GBTQ, AWQ).
- **Quantization-aware training (QAT)**: Build models with foresight that they'll be quantized. Tweaks training for resilience to precision loss. Required for extreme quantization (4-bit or lower). Used for famous 1-bit LLMs.

## How Quantization Works

### Quantization Scheme

The formula converting floats to integers is the quantization scheme. For symmetric clipping ranges (e.g., -1 to 1):

1. Compute scale `s` as the ratio between the real range length and integer range length
2. Quantize: `q = round(r / s)` where `r` is the real value

For asymmetric ranges (caused by ReLU, etc.), a **zero point** `z` acts as an offset:
- `z = round(-alpha / s) + q_min`
- Quantized value: `q = round(r / s) + z`

### Dequantization (Reverse)

Map quantized values back to approximate real values: `r_approx = s * (q - z)`

### Quantized Matrix Multiplication

For multiplying quantized operands Q1 and Q2:
1. Quantize operands
2. Apply integer multiplication function
3. Dequantize result

The scale `s` only needs to be applied once per output row, not every entry. On modern GPUs, float and int multiplications can be similarly fast, making memory bandwidth the real bottleneck — where quantization provides its primary gain.

### Fixed Point Arithmetic

To avoid floating-point multiplication by scale `s`:
- Express `s = 2^(-k) * s0` where `s0 > 0.5`
- Store `s0` as fixed-point number
- Multiplication becomes integer multiply + bit shifts
- Decomposition can be precomputed before deployment

### Quantization Granularity

In practice, multiple sets of quantization constants (s, z) are used — per layer, per matrix, or per matrix row. This applies to both weights and activations.

## Key Frameworks

Most ML frameworks (PyTorch, TensorFlow) offer built-in quantization support. Inference engines like ONNX Runtime and Nvidia TensorRT apply aggressive hardware-specific optimizations.

## See also

- [BitNet 1-bit LLM Architecture and Quantization-Aware Training](bitnet-1bit-llm-architecture.md)
- [BitNet b1.58: 1.58-bit Ternary LLM Performance and Scaling](../numbers/bitnet-b158-performance-scaling.md)

> Source: inbox/articles/how-llms-survive-quantization.md · processed 2026-07-14