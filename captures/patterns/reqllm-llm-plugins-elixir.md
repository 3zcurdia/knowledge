# ReqLLM: Composable LLM Interactions via Req Plugins

ReqLLM is an Elixir library that brings Req's middleware-driven approach to LLM interactions through a unified, plugin-based architecture. Each AI provider is implemented as a standard Req plugin.

## Features

- **45 providers and 665+ models** synced from models.dev with cost/context/capability metadata
- **Typed structs:** `Context`, `Message`, `ContentPart`, `StreamChunk`, `Tool`, `Response`
- **Built-in streaming** with structured `StreamChunk` metadata
- **Automatic cost tracking** using up-to-date pricing data
- **Secure key management** via JidoKeys/Dotenvy

## Usage

```elixir
# Simple text generation
{:ok, text} = ReqLLM.generate_text!("anthropic:claude-3-sonnet", "Hello world")

# Structured data with validation
{:ok, person} = ReqLLM.generate_object!("openai:gpt-4", "Generate a person", schema)

# Tool calling
{:ok, response} = ReqLLM.generate_text("anthropic:claude-3-sonnet", "Weather?", tools: [weather_tool])
```

## Architecture

Each provider implements `ReqLLM.Plugin` with `attach/2` (configure request) and `parse/2` (normalize response). This enables full Req middleware composition — rate limiting, retries, caching, custom headers — applied to LLM requests.

## Two Levels of Control

High-level helpers (`generate_text/3`) and low-level Req plugin API for advanced use cases with custom middleware.

> Source: inbox/articles/Introducing ReqLLM Req Plugins for LLM Interactions.md · processed 2026-07-02
