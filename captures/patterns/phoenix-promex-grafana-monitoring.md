# Phoenix Monitoring with PromEx, Prometheus, and Grafana

PromEx is an Elixir wrapper that simplifies Prometheus metrics collection for Phoenix apps. It provides plugins for VM stats, Phoenix requests, LiveView timing, Ecto queries, Oban jobs, and more, with auto-provisioned Grafana dashboards.

## Setup

Add PromEx to `mix.exs`, enable it in the supervision tree, then generate config:
```bash
mix prom_ex.gen.config --datasource YOUR_PROMETHEUS_DATASOURCE_ID
```

## Built-in Plugins

- **Application** — dependency counts, Git info, uptime
- **Beam** — schedulers, GC pauses, run-queue lengths
- **Phoenix** — HTTP request counts, durations, channel joins
- **PhoenixLiveView** — mount/handle_event timings and error counts
- **Ecto** — query timings, pool checkout waits
- **Oban** — job queue depth, execution and failure rates
- **Absinthe** — GraphQL execution timings
- **Broadway** — message throughput, batch latency

## Custom Plugins

Define a module with `use PromEx.Plugin`, implement `metrics/1` to emit gauges/counters/histograms, and optionally `dashboard/0` for auto-provisioned Grafana dashboards.

## Architecture

Prometheus scrapes the app's `/metrics` endpoint and stores time series. Grafana connects to Prometheus for dashboards, alerting, and exploration. Loki + Promtail handle structured log aggregation.

## Meta-Monitoring

Monitor Prometheus itself by exporting its `/metrics` to a secondary scraper. Track `prometheus_tsdb_head_series`, `process_resident_memory_bytes`, and `prometheus_rule_evaluation_failures_total`.

> Source: inbox/articles/Phoenix App Monitoring Grafana and PromEx Real-Time Setup.md · processed 2026-07-02
