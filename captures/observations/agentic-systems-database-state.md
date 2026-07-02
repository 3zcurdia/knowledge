# Agentic Systems Are Just Database State and Processes

Agentic AI concepts — memory, instruction routing, retrieval, context engineering — all collapse to processes and database state. You can build agentic systems with a database, standard web tooling, and real-time sync.

## Core Insight

Agents are processes that instruct LLMs to make tool calls. Agentic memory is where you store data those instructions are based on. Retrieval is querying that data. Context engineering retrieves and formats information for the instruction.

## Architecture (Burn Demo App)

- **Backend:** Phoenix + Elixir on the BEAM. Agents subscribe to events, instruct the LLM via Anthropic API, handle tool calls, and loop.
- **Data model:** Standard Postgres tables — Users, Threads, Events, Facts. No extensions or vectors.
- **Sync:** Phoenix.Sync syncs data from Postgres into both backend (for agents) and frontend (for users). DynamicSupervisor manages agent processes that scale with database contents.
- **Frontend:** TanStack DB collections with live queries provide reactive UI updates.

## Key Pattern

The instruction sent to the LLM is a functional representation of database state. The UI, agent control flow, and context engineering are all driven by the same data model.

## See also

- [Agentic Workflows with Oban Pro: Cascades, Human-in-the-Loop, Grafting](../patterns/oban-pro-agentic-workflows.md)
- [ReqLLM: Composable LLM Interactions via Req Plugins](../patterns/reqllm-llm-plugins-elixir.md)

> Source: inbox/articles/Bringing agents back down to earth.md · processed 2026-07-02
