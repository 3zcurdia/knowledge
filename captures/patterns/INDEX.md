# Patterns Index

> Auto-maintained token-saving index for `captures/patterns/`. Read this first; open full files only as needed. One line per file.

- [AI Movie Upscaling Pipeline for Local Hardware](ai-movie-upscaling-pipeline.md) — Denoise DVD sources before upscaling with Real-ESRGAN locally, then reassemble video while managing large temporary frame storage.
- [AST-Grep: Structural Code Find-and-Replace for Elixir](ast-grep-elixir-code-refactoring.md) — Use AST patterns with relational rules and metavariables to refactor Elixir code structurally instead of text-based replacement.
- [Avoiding Double Mount in Phoenix LiveView](avoiding-double-mount-phoenix-liveview.md) — Eliminate LiveView double mount by parking the dead-render socket for WebSocket adoption instead of guarding with connected.
- [BEAM Binary Hot Path Optimization: Accumulator, Match Context, Chunk Matching, Cheap Map Keys](beam-binary-hot-path-optimization.md) — Speed up binary encoding and decoding with a single append-only accumulator, preserved match contexts, clause dispatch, and cheap map keys.
- [BEAM File Descriptor Limits: ulimit, +Q, and Containers](beam-file-descriptor-limits.md) — Raise host ulimit, container ulimit, and BEAM plus Q together to 65536 so new connections are not refused.
- [SWAR String Scanning on the BEAM with 56-bit Words](beam-swar-string-scanning.md) — Scan seven bytes at once using 56-bit integer arithmetic in guards to avoid per-byte terms and bignum allocation.
- [BitNet 1-bit LLM Architecture and Quantization-Aware Training](bitnet-1bit-llm-architecture.md) — Replace linear layers with ternary BitLinear layers trained with quantization-aware training for faster lower-memory inference.
- [Communication Overhead Is the Real Bottleneck](communication-overhead-bottleneck.md) — Team productivity is limited by quadratically growing coordination cost, so smaller scope and clear ownership matter more than coding speed.
- [Custom HTML Elements in LLM Chat Responses](custom-html-elements-llm-chat.md) — Teach LLMs custom HTML tags, render them through MDEx, and implement matching Web Components for rich chat UI.
- [Distributed ML Inference on BEAM with Nx.Serving](distributed-ml-inference-beam-nx-serving.md) — Partition dependencies and supervision roles so web nodes call Nx.Serving transparently while models run on a separate ML node.
- [Connecting Open-WebUI to LM Studio via Docker](docker-open-webui-lm-studio-setup.md) — Connect Open-WebUI to LM Studio as an OpenAI-compatible backend using correct ports, host gateway mapping, and persistent socat.
- [Elixir Testing Philosophy: Test What Matters](elixir-testing-philosophy.md) — Test public module-boundary contracts and integration behavior rather than trivial functions, private internals, or coverage targets.
- [Event Sourcing for Agentic Workflows](event-sourcing-for-agentic-workflows.md) — Persist workflow decisions and results as an append-only log so crashed processes rebuild state by replaying side-effect-free transitions.
- [GenServer as the Owner of Agentic Workflow State](genserver-owns-agentic-workflow-state.md) — Model agentic runs as one GenServer per execution owning state while the LLM only receives derived context and tools run elsewhere.
- [Language Paradigm Patterns in Ray Tracing Implementations](language-paradigm-patterns-ray-tracing.md) — Contrast Ruby inheritance and mutation with Elixir protocols and immutability, plus BVH and tile parallelism for ray tracing speed.
- [Distributed Systems Lessons from LiveView: State Ownership and Eventual Consistency](liveview-distributed-systems-lessons.md) — Validate business rules on the backend and distinguish empty from absent state with loading indicators for eventual consistency.
- [LLM Benchmark Prompts for Text Processing](llm-benchmark-prompts-text-processing.md) — Provide reusable prompts covering writing, summarization, extraction, classification, translation, JSON, OCR, analysis, and RAG.
- [Agentic Workflows with Oban Pro: Cascades, Human-in-the-Loop, Grafting](oban-pro-agentic-workflows.md) — Build durable agentic workflows with Oban cascades, snoozed human checkpoints, and runtime-expanded grafted subworkflows.
- [Phoenix Monitoring with PromEx, Prometheus, and Grafana](phoenix-promex-grafana-monitoring.md) — Collect Phoenix, BEAM, Ecto, Oban, and LiveView metrics with PromEx plugins scraped by Prometheus and visualized in Grafana.
- [Quantization Fundamentals for LLMs](quantization-fundamentals-llms.md) — Convert weights and activations to lower-precision integers using scales, zero points, and granularity choices to shrink models and inference cost.
- [Reusable Drag-and-Drop Image Upload Custom Element in Rails](rails-image-upload-custom-element.md) — Implement a framework-independent image-upload Web Component that manages its own file input, previews, drag feedback, and removal.
- [ReqLLM: Composable LLM Interactions via Req Plugins](reqllm-llm-plugins-elixir.md) — Access many LLM providers through composable Req plugins with typed structs, streaming, cost tracking, and middleware support.
- [Simplified DDD in Elixir with Ecto](simplified-ddd-elixir-ecto.md) — Structure Elixir apps with Ecto-backed aggregates, plain domain events, application-service contexts, and separate query modules.
- [Two-Track Workflow for Coding Agents](two-track-workflow-coding-agents.md) — Run a high-attention spec track in parallel with a low-attention implementation track because human specification is the bottleneck.
