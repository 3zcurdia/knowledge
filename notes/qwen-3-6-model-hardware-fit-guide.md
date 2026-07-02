# Qwen 3.6 Model Hardware Fit Guide

The latest Qwen 3.6 open-weight models are Qwen3.6-27B (dense) and
Qwen3.6-35B-A3B (Mixture of Experts). Despite 35B total parameters, the MoE
architecture only activates ~3B parameters per token, making it lighter to run than
the dense 27B while delivering flagship-level performance on coding and reasoning.

## Recommended Configurations

| Hardware          | Recommended Model       | Experience |
|------------------|------------------------|------------|
| M4 Pro 24GB      | Qwen3.6-35B-A3B (Q4)   | Excellent  |
| RTX 5060 Ti 16GB | Qwen3.6-35B-A3B (Q4)   | Excellent  |
| M4 Pro 24GB      | Qwen3.6-27B (Q4)       | Good, slower, more memory usage |
| RTX 5060 Ti 16GB | Qwen3.6-27B (Q4)       | May require offloading or lower-bit quantization |

## Runtimes by Platform

| Platform  | Runtime Options        |
|-----------|-----------------------|
| Apple Silicon | MLX or Ollama  |
| NVIDIA    | Ollama or llama.cpp  |

## Qwen 3.6 Improvements

According to the official Qwen 3.6 release, focus areas include:
- Repository-level reasoning
- Agentic coding
- Better frontend/backend integration
- Preserving reasoning across long coding sessions

## For Elixir + Phoenix Development

Recommended stack:
- **Model**: Qwen3.6-35B-A3B (Q4)
- **Runtime**: Ollama (both platforms), MLX (Apple)
- **IDE**: VS Code + Continue, Cline, or OpenCode
- **Context**: Your project, Phoenix source, LiveView source, HexDocs, Elixir stdlib,
  Ecto

Pairing the model with project-specific context via RAG (indexing the repository and
documentation) dramatically improves accuracy for Elixir development.

## See also

- [Top Use Cases for Local LLMs](top-use-cases-for-local-llms.md)
- [LLM Benchmark Prompts for Text Processing](../captures/patterns/llm-benchmark-prompts-text-processing.md)
- [AI Movie Upscaling Pipeline for Local Hardware](../captures/patterns/ai-movie-upscaling-pipeline.md)

> Source: inbox/chats/local-models.md · processed 2026-07-02
