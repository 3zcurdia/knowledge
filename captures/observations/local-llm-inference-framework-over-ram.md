# Local LLM Inference Depends More on Framework Than Raw RAM

A 22B-parameter LLM ran in production on a Linux PC with a 16GB VRAM GPU while the exact same model failed to load on a Mac Mini with 24GB of RAM, revealing that inference-stack optimizations matter more than raw memory specs for local AI deployment.

## What happened

Same model, two machines:

- **Linux PC, 16GB VRAM GPU** — model loaded and ran in production.
- **Mac Mini, 24GB unified RAM** — model failed to load.

The Mac Mini had more total memory. It still could not run the model. The difference was the inference framework: CUDA-optimized stacks (vLLM, SGLang) had mature quantization and PagedAttention support for the Linux path; the Apple Silicon path relied on MLX or llama.cpp, which at the time handled this model shape less efficiently.

## The lesson

When sizing hardware for local LLM deployment, raw VRAM/unified-memory size is a necessary but not sufficient condition. Two more variables dominate:

- **Framework support** — does the inference stack have working kernels for this model architecture and quantization? CUDA-first stacks typically ship wider support faster than Metal/MLX.
- **Quantization tier** — the same "22B" model can be 4-bit, 8-bit, or full precision. Memory requirement is not a function of parameter count alone.

Specs on a sticker tell you almost nothing. Compatibility between model + framework + quantization tells you everything.

## See also

- [Local AI as Default: On-Device Processing Over Cloud APIs](local-ai-default-architecture.md)
- [Top Use Cases for Local LLMs](../../notes/top-use-cases-for-local-llms.md)
- [Qwen 3.6 Model Hardware Fit Guide](../../notes/qwen-3-6-model-hardware-fit-guide.md)

> Source: jarvis/01-captures/observations/Local LLM inference depends more on framework than raw RAM.md · processed 2026-07-09
