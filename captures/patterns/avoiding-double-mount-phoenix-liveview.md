# Avoiding Double Mount in Phoenix LiveView

Every LiveView mounts twice on first page load: once for the static HTTP dead render, then again when the WebSocket connects. This means `mount/3`, `handle_params/3`, and `render/1` all run twice on first load.

## Why connected?/1 Is a Band-Aid

The common `connected?(socket)` guard does not stop the double render — it just trades the query for an empty first paint, breaking SEO, link previews, and no-JavaScript fallback. The structural duplication (auth, `current_user`, layout, `on_mount` hooks) remains untouched.

Costs of the `connected?/1` guard:

- **Empty first paint** — skeleton/spinner until WebSocket connects; pushes Largest Contentful Paint behind the socket
- **Broken SEO and link previews** — crawlers and social unfurlers get the empty dead render; `og:image`, `og:description` live in the root layout which only renders on the dead render
- **JavaScript dependency** — the page needs JS to show anything, breaking graceful degradation
- **Smeared connection logic** — `if connected?(socket)` forks multiply through `mount/3`

## What the Phoenix Team Is Building: Adoptable LiveViews

Issue [#3551](https://github.com/phoenixframework/phoenix_live_view/issues/3551) proposes keeping the dead-render process alive and letting the WebSocket adopt it. One mechanism, two wins: no second mount on first load, and process reuse on reconnect. As of mid-2026, the direction is accepted but no implementation is shipped yet.

## The :resume Fork (Interim Solution)

A fork of `phoenix_live_view` adds an opt-in `:resume` feature:

1. Dead render mounts fully, hands the socket to a holder process (GenServer under DynamicSupervisor)
2. Signs the key into a token emitted as `data-phx-resume` on the root element
3. On WebSocket connect, client sends the token back; server verifies and redeems the parked socket
4. The parked state is spliced into the live socket — neither `mount/3` nor `on_mount` hooks run again

### Configuration

```elixir
# config/config.exs — opt in for the whole app
config :phoenix_live_view, :resume,
  enabled: true,
  ttl: 5_000,           # how long a parked socket waits for its WebSocket, in ms
  max_children: 10_000  # backpressure: cap on concurrently parked sockets
```

```elixir
# ...or opt in per LiveView
defmodule MyAppWeb.DashboardLive do
  use Phoenix.LiveView, resume: true
end
```

### Lifecycle Table

| Callback | Dead render (HTTP) | Cold connect (no resume) | Warm connect (resumed) |
| --- | --- | --- | --- |
| `mount/3` | runs | runs again | **skipped** |
| `on_mount` hooks | run | run again | **skipped** |
| `on_connect/1` | — | runs | **runs** |
| `handle_params/3` | runs | runs again | **skipped** (initial only) |
| `render/1` | static HTML | full render | full render |

`handle_params/3` is skipped only on the initial resumed connect (identical URL to dead render). It still runs on `push_patch`, live navigation, and parameter changes.

## Four Migration Patterns

### 1. Data loads: delete the connected? guard

```elixir
# ❌ Stock pattern — under resume this loads nothing, ever
def mount(_params, _session, socket) do
  posts = if connected?(socket), do: Blog.list_posts(), else: []
  {:ok, assign(socket, :posts, posts)}
end

# ✅ Resume — load once on the dead render; reused on connect
def mount(_params, _session, socket) do
  {:ok, assign(socket, :posts, Blog.list_posts())}
end
```

### 2. Connection-only side effects: move to on_connect/1

```elixir
# ❌ Never fires under resume
def mount(_params, _session, socket) do
  if connected?(socket) do
    MyAppWeb.Endpoint.subscribe("room:lobby")
    :timer.send_interval(1_000, :tick)
  end
  {:ok, socket}
end

# ✅ on_connect/1 is the reliable home for connection-only work
def on_connect(socket) do
  MyAppWeb.Endpoint.subscribe("room:lobby")
  :timer.send_interval(1_000, :tick)
  {:ok, socket}
end
```

### 3. Values derived from connect params: use cookies

`get_connect_params/1` returns `nil` on the dead render. Move persisted client state to a cookie read via a plug:

```elixir
plug :put_welcome_flag

defp put_welcome_flag(conn, _opts) do
  conn = fetch_cookies(conn)
  Plug.Conn.put_session(conn, "show_welcome", conn.cookies["show_welcome"] != "false")
end

def on_mount(:welcome, _params, session, socket) do
  {:cont, assign(socket, :show_welcome?, Map.get(session, "show_welcome", true))}
end
```

### 4. Real-time data: snapshot on dead render, subscribe on connect

```elixir
# Dead render loads the count; reused on connect
def on_mount(:notifications, _params, _session, socket) do
  {:cont, assign(socket, :unread, Notifications.count(socket.assigns.current_user))}
end

# On connect: just subscribe
def on_connect(socket) do
  Notifications.subscribe(socket.assigns.current_user.id)
  {:ok, socket}
end

def handle_info({:new_notification, _}, socket) do
  {:noreply, update(socket, :unread, &(&1 + 1))}
end
```

## Verification

```bash
# 1. Dead render must stamp the token (server half working)
curl -s http://localhost:4000/ | grep -o 'data-phx-resume="[^"]*"' | head -1

# 2. Shipped bundle must contain the resume client
grep -c 'data-phx-resume' priv/static/assets/js/app.js

# 3. Watch server log on fresh page load: mount/3 and queries run once
```

## Summary

Under resume, sort work into three homes:

- **`mount/3` and `on_mount` hooks** — pure, dead-render-derivable assigns (runs once, reused)
- **`on_connect/1`** — connection-only side effects (subscriptions, timers, presence)
- **Cookie/session on dead render** — anything previously from `get_connect_params/1`

> Source: inbox/articles/Stop mounting your LiveView twice.md · processed 2026-07-02
