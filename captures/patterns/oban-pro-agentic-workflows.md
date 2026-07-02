# Agentic Workflows with Oban Pro: Cascades, Human-in-the-Loop, Grafting

Oban Pro v1.6+ provides primitives for agentic workflows: cascading job chains, human-in-the-loop checkpoints, and dynamic workflow grafting.

## Cascading Workflows

Link functions together with shared context, automatic retries, and distribution across nodes:
```elixir
Workflow.new()
|> Workflow.put_context(%{source: source, model: "gpt-4o-mini"})
|> Workflow.add_cascade(:plan, &plan/1)
|> Workflow.add_cascade(:draft, &draft/1, deps: :plan)
|> Workflow.add_cascade(:revise, &revise/1, deps: :draft)
|> Oban.insert_all()
```

## Human-in-the-Loop

Pause workflows for human review using `Oban.update_job/3` to modify tags and `{:snooze, {1, :hour}}` to wait. Humans approve/deny by updating tags, then triggering retry.

## Workflow Grafting

Define a placeholder in a workflow, then expand it into a sub-workflow at runtime. Downstream jobs automatically depend on the expanded graft — you don't need to know up front which jobs will run.

```elixir
|> Workflow.add_graft(:load, &load_accounts/1, deps: :draft)
|> Workflow.add_cascade(:finish, &finish_campaign/1, deps: [:draft, :load])
```

## Key Benefits

- Durable, self-hosted, transactionally guaranteed
- No external infrastructure needed
- Works for both agentic and non-agentic deterministic workflows

## See also

- [Agentic Systems Are Just Database State and Processes](../observations/agentic-systems-database-state.md)
- [ReqLLM: Composable LLM Interactions via Req Plugins](reqllm-llm-plugins-elixir.md)
- [Phoenix Monitoring with PromEx, Prometheus, and Grafana](phoenix-promex-grafana-monitoring.md)

> Source: inbox/articles/Unlocking Agentic Workflows with Oban Pro.md · processed 2026-07-02
