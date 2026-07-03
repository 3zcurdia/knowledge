# Simplified DDD in Elixir with Ecto

A pragmatic, simplified Domain-Driven Design approach for structuring Elixir applications, balancing clean domain models with Ecto/Ecto/Phoenix conventions.

## Core Concepts

### Domain Events

Defined as plain structs containing only the relevant information, without persistence concerns (no ID, no timestamp). Can be published as-is or converted to Ecto schema structs for persistence.

```elixir
defmodule MyApp.Tasks.Events.WorkspaceRenamed do
  @enforce_keys [:workspace_id, :new_name]
  defstruct [:workspace_id, :new_name]
end
```

### Aggregates

Defined as `Ecto.Schema` modules (not plain structs). Use case-specific changeset functions enforce invariants and return domain events when valid and having changes. This avoids duplicating validation logic between aggregates and changesets.

```elixir
defmodule MyApp.Tasks.Workspace do
  use Ecto.Schema

  alias MyApp.Tasks.Events.WorkspaceRenamed

  @name_max_length 50

  schema "workspaces" do
    field :name, :string
    field :index, :integer
    field :user_id, :binary_id
  end

  def rename_changeset(%__MODULE__{} = workspace, attrs) do
    changeset =
      workspace
      |> cast(attrs, [:name])
      |> validate_required([:name])
      |> validate_length(:name, max: @name_max_length)

    wrap_changeset(changeset, %WorkspaceRenamed{
      workspace_id: workspace.id,
      new_name: changeset.changes[:name]
    })
  end

  defp wrap_changeset(changeset, domain_event) do
    if changeset.valid? and changeset.changes != %{} do
      {changeset, List.wrap(domain_event)}
    else
      {changeset, []}
    end
  end
end
```

All invariants that apply to single aggregates must be enforced in these changeset functions, and aggregates must not be manipulated anywhere else.

### Value Objects

- Primitive values: either primitive fields in the aggregate schema or wrapper structs with Ecto custom types (e.g. `MyApp.Tasks.ProjectStatus`). Validation still belongs in aggregate changeset functions so HTML input attributes are set correctly.
- Complex values: Ecto schemas or embedded schemas.

### Repositories

Separate repositories are omitted since changesets handle aggregate manipulation directly. If needed, repo modules can wrap `Ecto.Repo.insert_or_update`:

```elixir
defmodule MyApp.Tasks.WorkspaceRepo do
  def save(workspace_changeset) do
    MyApp.Repo.insert_or_update(workspace_changeset)
  end
end
```

### Domain Services

Any data manipulation involving more than one aggregate goes in a domain service module. If it only touches aggregates within a single Phoenix context, it can be a sub-module. Otherwise, a top-level module. All cross-aggregate invariants are enforced here.

### Application Services

Context modules serve as application services: they call aggregate and service functions, apply changes to the repo, and publish domain events on success.

```elixir
defmodule MyApp.Tasks do
  alias MyApp.Repo
  alias MyApp.Tasks.Workspace

  def rename_workspace(%Workspace{} = workspace, %{} = attrs) do
    {changeset, domain_events} = Workspace.rename_changeset(workspace, attrs)

    case Repo.update(changeset) do
      {:ok, struct} ->
        publish_domain_events(domain_events)
        {:ok, struct}

      {:error, reason} ->
        {:error, reason}
    end
  end
end
```

### Queries

Read queries live in separate modules. Context modules may delegate to them and apply authorization checks before calling `Repo.all` or `Repo.get`.

### Views

View modules define specific queries or combine results from query modules for views that require particular shapes or multiple resources.

## Alternatives

Stricter approaches include defining aggregates as plain structs with functions returning updated structs (mapping to Ecto in dedicated repo modules), or using command structs (e.g. `MyApp.Tasks.RenameWorkspaceCommand`) for form validation. The tradeoff is shared validation logic between commands and aggregates, and mapping aggregate errors to command errors.

> Source: inbox/articles/Simplified DDD in Elixir.md · processed 2026-07-02
