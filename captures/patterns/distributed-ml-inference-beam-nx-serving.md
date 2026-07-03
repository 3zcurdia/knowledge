# Distributed ML Inference on BEAM with Nx.Serving

A pattern for offloading ML inference to a remote node while keeping the calling code unchanged. Uses one umbrella codebase, two releases, and three node roles.

## Architecture: One Codebase, Two Releases, Three Roles

| Role | Node | Starts | FINANCE_ROLE |
| --- | --- | --- | --- |
| `:web` | Linux | Phoenix, Postgres, Jido, classification logic | `web` |
| `:ml` | MacBook | only the `Nx.Serving` (model + EXLA) | `ml` |
| `:all` | Dev/Test | everything in one node | (default) |

The web node brings up classification logic (label vectors, cosine similarity) but offloads only the heavy embedding step to the ML node. The ML node has no database, no Phoenix, no `DATABASE_URL`.

## Building Block 1: Dependency Partitioning with runtime: false

ML stack NIFs (`libexla`, `libex_tokenizers`) are architecture-specific and cannot cross platforms. Use `runtime: false` to exclude them from the web release's OTP application closure:

```elixir
# apps/finance/mix.exs
defp deps do
  [
    {:nx, "~> 0.12"},  # normal dep — runs on both nodes
    {:bumblebee, "~> 0.6", runtime: false},
    {:exla, "~> 0.9", runtime: false},
    {:tokenizers, "~> 0.5", runtime: false, override: true},
    # ...
  ]
end
```

`nx` is a normal dependency because the web node needs it for cosine similarity and `batched_run`. Only EXLA compilation and Bumblebee model loading are exclusive to the ML node.

### Two Release Definitions

```elixir
# mix.exs (umbrella root)
defp releases do
  [
    finance_web: [
      applications: [finance: :permanent, finance_web: :permanent],
      include_erts: false,
      steps: [:assemble, :tar]
    ],
    finance_ml: [
      applications: [
        finance: :permanent,
        bumblebee: :permanent, exla: :permanent, tokenizers: :permanent
      ],
      include_erts: true,
      steps: [:assemble, :tar]
    ]
  ]
end
```

Each release must be built on its target architecture (Linux for web, macOS for ML).

## Building Block 2: Role-Based Supervision Tree

`Application.start/2` reads `FINANCE_ROLE` and assembles the supervision tree:

```elixir
def start(_type, _args) do
  role = role()
  children = cluster_children() ++ web_children(role) ++ serving_children(role)
  Supervisor.start_link(children, strategy: :one_for_one, name: Finance.Supervisor)
end

defp web_children(:ml), do: []
defp web_children(_role), do: [Finance.Repo, {Phoenix.PubSub, name: Finance.PubSub}, Finance.Jido]

defp serving_children(:web), do: []
defp serving_children(:ml), do: [Finance.Classifier.Bumblebee]
defp serving_children(:all) do
  case Application.get_env(:finance, :classifier) do
    nil -> []
    Finance.Classifier.Stub -> []
    module -> [module]
  end
end
```

| Child | :web | :ml | :all |
| --- | --- | --- | --- |
| `Finance.Repo` (Postgres) | yes | no | yes |
| `Phoenix.PubSub`, `Jido` | yes | no | yes |
| `Nx.Serving` (Bumblebee) | no | yes | config-dep |

## Building Block 3: Distributed Nx.Serving — Location Transparency

`Nx.Serving` is location-transparent by design. A started serving registers in a cluster-wide process group. `batched_run/2` resolves the name to a serving member (local or remote) and routes input there:

```elixir
defp embed(text, prefix) do
  Nx.Serving.batched_run(@serving_name, prefix <> text)
catch
  :exit, reason -> throw({:classifier_unavailable, reason})
end
```

The calling code is identical whether the serving is local or remote. When unreachable, `batched_run` exits with `:noproc` — caught and translated to `{:error, :classifier_unavailable}`.

### Web Node: Nx Without EXLA

```elixir
# config/runtime.exs
if role == :web do
  config :nx, :default_backend, Nx.BinaryBackend
end
```

## Cluster Connectivity

`libcluster` with static EPMD strategy, shared `RELEASE_COOKIE`, and `FINANCE_CLUSTER_HOSTS` env var listing both nodes. ML node starts first so the serving is registered before the web node fires the first `batched_run`.

## Failure Handling

If the ML node is unreachable, `batched_run` exits with `:noproc`. This is caught and returns `{:error, :classifier_unavailable}` — callers treat it as "try again later." Transactions are left unclassified rather than incorrectly classified. Since classification runs asynchronously through a Jido agent, an unreachable ML node never blocks a web request.

## What This Costs

- A few lines of role logic in the supervision tree
- `runtime: false` on three deps plus two release definitions
- One `catch` for the unreachable node
- A handful of env variables (cookie, distribution, cluster hosts)

What it does not cost: no API definition, no serialization layer, no service mesh, no second language, no second repo. The calling code changes by zero lines between "all local" and "model on the Mac."

> Source: inbox/articles/Splitting an ML model and a web app across two BEAM nodes — the technical blueprint.md · processed 2026-07-02
