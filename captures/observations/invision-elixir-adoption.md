# Invision AI: Adopting Elixir to Simplify System Architecture

Invision AI replaced a fragmented stack of C++, Go, Python, and JavaScript with Elixir for their real-time mobility systems (vehicle occupancy detection, incident detection).

## Why Elixir

- **Concurrency + fault tolerance:** BEAM processes communicate only via message passing (no shared mutable state), supervisors handle restarts automatically.
- **Full-stack with Phoenix LiveView:** Replaced Django + Go + C++ web stack. LiveView's server-owned rendering eliminates client-side JS for real-time updates.
- **Introspection:** REPL inside running BEAM can inspect GenServer state, query process CPU usage, and call functions in production.
- **Learning curve:** Team went from zero Elixir to productive in 2 weeks using "Elixir in Action" and Elixir School. First merge requests within 2 weeks.
- **Testing:** Can run tests from a separate BEAM instance against production docker images using `:erpc.call/4`.

## Key Tools

- **Oban** for job scheduling with queues, retries, and monitoring
- **Telemetry** package for metrics export to Prometheus
- **Ecto** for composable SQL queries
- **Permit** for attribute-based access control (ABAC) with Ecto, Phoenix, LiveView, and Absinthe integrations

## Authorization with Permit

The Permit library provides ABAC for Elixir applications. Four libraries: base `permit`, `permit_ecto`, `permit_phoenix`, `permit_absinthe`. DSL-free syntax inspired by Ruby's CanCan, with only positive declarations (no `cannot`).

ACL, RBAC, and ReBAC are all reducible to Permit's ABAC model. Rules can be based on specific user IDs (ACL), roles (RBAC), or relationship entities (ReBAC). Generates Ecto queries from conditions — `accessible_by` fetches only authorized records.

## Results

Single person implemented a production-ready web app in 2 months with tests, concurrency, and full-stack features. Migration from C++/Go/Python stack nearly complete.

## See also

- [Elixir Testing Philosophy](../patterns/elixir-testing-philosophy.md)
- [Simplified DDD in Elixir with Ecto](../patterns/simplified-ddd-elixir-ecto.md)
- [Agentic Workflows with Oban Pro: Cascades, Human-in-the-Loop, Grafting](../patterns/oban-pro-agentic-workflows.md)
- [Distributed Systems Lessons from LiveView: State Ownership and Eventual Consistency](../patterns/liveview-distributed-systems-lessons.md)
- [The Joy of Simpler Systems](joy-of-functional-languages.md)

> Source: inbox/articles/Elixir A Journey to Simplifying System Architecture.md · processed 2026-07-02
> Merged: captures/patterns/elixir-authorization-permit-library.md · 2026-09-09
