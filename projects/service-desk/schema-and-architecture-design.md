# Service Desk Application Schema and Architecture Design

Elixir/Phoenix design for a service desk app with ticket management (Kanban board:
icebox, in_progress, done), team transfer, agent chat, live chat with attachments, and
audit trail.

## PostgreSQL Schema

### users

Agents and admins. Auth via phx_gen_auth or Guardian.

| Column      | Type           | Constraints         |
|------------|----------------|---------------------|
| id         | uuid           | PK                  |
| email      | string         | Unique, login       |
| name       | string         |                     |
| role       | string         | Enum: :admin, :agent|
| avatar_url | string         | Optional            |
| inserted_at | utc_datetime  |                     |
| updated_at  | utc_datetime  |                     |

### teams

Logical groups of agents. Tickets are routed to teams.

| Column      | Type           | Constraints      |
|------------|----------------|------------------|
| id         | uuid           | PK               |
| name       | string         | Unique           |
| description| string         | Optional         |
| inserted_at | utc_datetime  |                  |
| updated_at  | utc_datetime  |                  |

### tickets

Core entity driving the Kanban board.

| Column           | Type           | Constraints |
|-----------------|----------------|-------------|
| id              | uuid           | PK          |
| title           | string         |             |
| description     | text           | Optional    |
| status          | string         | Indexed; enum: :icebox, :in_progress, :done |
| priority        | string         | Enum: :low, :medium, :high, :urgent |
| customer_email  | string         | Indexed     |
| customer_name   | string         |             |
| assigned_agent_id | uuid         | FK → users.id (nullable) |
| team_id         | uuid           | FK → teams.id (nullable), indexed |
| channel_id      | uuid           | FK → channels.id |
| inserted_at     | utc_datetime   |             |
| updated_at      | utc_datetime   |             |

### channels

One channel per ticket (1:1). The live chat room.

| Column      | Type           | Constraints |
|------------|----------------|-------------|
| id         | uuid           | PK          |
| ticket_id  | uuid           | FK → tickets.id (1:1), indexed |
| status     | string         | Enum: :open, :closed |
| inserted_at | utc_datetime  |             |
| updated_at  | utc_datetime  |             |

### messages

All chat messages. Polymorphic sender via sender_type.

| Column           | Type           | Constraints |
|-----------------|----------------|-------------|
| id              | uuid           | PK          |
| channel_id      | uuid           | FK → channels.id, indexed |
| sender_type     | string         | Enum: :agent, :customer, :system; indexed |
| sender_id       | uuid           | FK → users.id (nil if customer/system) |
| body            | text           | Text content (nil if attachment only) |
| content_type    | string         | Enum: :text, :image, :document, :system_event |
| attachments     | map (JSONB)    | `[{url, filename, mime_type, size}]` |
| metadata        | map (JSONB)    | System event data, read receipts |
| inserted_at     | utc_datetime   |             |

Indexes:
- Unique index on `idempotency_key`
- Composite index on `[sender_type, sender_id]`

### audit_logs

Immutable trail. Never update or delete rows.

| Column      | Type           | Constraints |
|------------|----------------|-------------|
| id         | uuid           | PK          |
| ticket_id  | uuid           | FK → tickets.id, indexed |
| actor_id   | uuid           | FK → users.id (nil = system) |
| actor_type | string         | Enum: :agent, :system |
| action     | string         | Indexed; e.g. status_changed, team_transferred, assigned |
| changes    | map (JSONB)    | `%{from: ..., to: ...}` |
| inserted_at | utc_datetime  |             |

### team_memberships (join table)

Many-to-many: users ↔ teams.

| Column   | Type           | Constraints |
|---------|----------------|-------------|
| user_id | uuid           | FK → users.id |
| team_id | uuid           | FK → teams.id |
| role    | string         |             |
| inserted_at | utc_datetime |          |

Unique constraint on `[agent_id, team_id]`.

## Architecture

Single Phoenix app with 4 bounded contexts (not umbrella):

| Context    | Key Functions |
|-----------|--------------|
| Tickets   | create/update, move_status/2, transfer_team/3, assign_agent/3 |
| Messaging | send_message/3, list_messages/1, upload_attachment/2, broadcast_message/2 |
| Accounts  | list_agents/0, add_to_team/2, agent_teams/1, authorize_channel/2 |
| AuditTrail | log/3 (ticket, actor, action), list_for_ticket/1 — called via Ecto.Multi |

## Key Design Decisions

### 1. channels is 1:1 with tickets

Create the channel atomically when the ticket is created via Ecto.Multi. Chat room
lifecycle is tied to the ticket.

### 2. Agent authorization for chat

```elixir
# In Messaging context
def can_respond?(agent, channel) do
  ticket = Repo.preload(channel, :ticket).ticket
  agent.id == ticket.assigned_agent_id or
    Enum.any?(agent_team_ids(agent), &(&1 == ticket.team_id))
end
```

### 3. Audit trail via Ecto.Multi

Every ticket mutation is wrapped in a Multi for atomic audit logging:

```elixir
Ecto.Multi.new()
|> Ecto.Multi.update(:ticket, changeset)
|> Ecto.Multi.insert(:audit, AuditLog.changeset(%{
    ticket_id: ticket.id,
    actor_id: agent.id,
    action: "status_changed",
    changes: %{from: old_status, to: new_status}
  }))
|> Repo.transaction()
```

### 4. Live chat via Phoenix.Channel + PubSub

- Agent UI: Phoenix.LiveView subscribes to `"channel:{id}"`
- Customer widget: JavaScript client via Phoenix.Channel (WebSocket)
- File uploads: chunked via `LiveView allow_upload/3` → S3, then message with
  attachment metadata

### 5. messages.attachments as JSONB

Avoids a separate attachments table. Each message can carry
`[{url, filename, mime_type, size_bytes}]`. Simple, queryable with Postgres JSONB
operators.

### 6. Kanban board

Pure Phoenix.LiveView with phx-click drag-and-drop. Status transitions validated
with a state machine:

```elixir
@transitions %{
  icebox: [:in_progress],
  in_progress: [:icebox, :done],
  done: [:in_progress]
}
```

## Dependencies (Mix)

```elixir
{:phoenix, "~> 1.7"},
{:phoenix_live_view, "~> 0.20"},
{:ecto_sql, "~> 3.11"},
{:postgrex, ">= 0.0.0"},
{:guardian, "~> 2.3"},           # JWT auth
{:oban, "~> 2.17"},              # Background jobs (email notifs)
{:waffle_ecto, "~> 0.0.11"},     # File uploads → S3
{:ex_aws_s3, "~> 2.5"},
{:jason, "~> 1.4"},
{:swoosh, "~> 1.16"}             # Email
```

## Generator Commands (run order)

```bash
# 1. Authentication
mix phx.gen.auth Accounts User users --binary-id

# 2. Teams
mix phx.gen.live Teams Team teams name:string slug:string:unique members_count:integer --binary-id

# 3. Customers
mix phx.gen.live Customers Customer customers name:string email:string:unique --binary-id

# 4. Agents (user_id nullable, add null: true in migration)
mix phx.gen.live Agents Agent agents display_name:string type:integer user_id:references:users --binary-id

# 5. Teams ↔ Agents (schema only, no UI)
mix phx.gen.schema TeamsAgents TeamAgent teams_agents agent_id:references:agents team_id:references:teams --binary-id

# 6. Channels
mix phx.gen.live Messaging Channel channels name:string messages_count:integer summary:text --binary-id

# 7. Messages (polymorphic sender via sender_type + sender_id)
mix phx.gen.live Messaging Message messages \
  channel_id:references:channels type:integer content:text meta:map \
  sender_type:string sender_id:binary_id received_at:utc_datetime \
  received_read_at:utc_datetime idempotency_key:binary --binary-id

# 8. Notes
mix phx.gen.live Agents Note notes agent_id:references:agents content:text --binary-id

# 9. Tickets (agent_id nullable)
mix phx.gen.live Tickets Ticket tickets \
  title:string description:text channel_id:references:channels \
  status:integer priority:integer team_id:references:teams \
  agent_id:references:agents close_note:text closed_at:utc_datetime --binary-id

# 10. Ticket Trail (schema only, append-only)
mix phx.gen.schema Tickets TicketTrail ticket_trails \
  ticket_id:references:tickets owner_id:references:agents changes:map --binary-id
```

## Post-scaffold Migration Patches

```elixir
# agents — optional user
add :user_id, references(:users, type: :binary_id, on_delete: :nilify_all), null: true

# tickets — optional agent
add :agent_id, references(:agents, type: :binary_id, on_delete: :nilify_all), null: true

# ticket_trails — optional owner (system actions)
add :owner_id, references(:agents, type: :binary_id, on_delete: :nilify_all), null: true

# messages — composite unique index for idempotency
create unique_index(:messages, [:idempotency_key])

# messages — index for polymorphic sender lookups
create index(:messages, [:sender_type, :sender_id])

# teams_agents — composite PK / unique constraint
create unique_index(:teams_agents, [:agent_id, :team_id])
```

> Source: inbox/chats/sevice-desk-design.md · processed 2026-07-02
