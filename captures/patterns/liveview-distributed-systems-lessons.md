# Distributed Systems Lessons from LiveView: State Ownership and Eventual Consistency

Two distributed systems lessons from building a LiveView web chat: state ownership and eventual consistency.

## Lesson 1: State Ownership

Web applications are distributed systems. Frontend validation is useful for UX but cannot enforce business rules — users can bypass it via DevTools. The knowledge of what constitutes valid data belongs on the backend.

LiveView's bi-directional protocol makes this clean: the backend validates and replies with `%{accepted: true/false}`, and the frontend acts on the reply (e.g. caching in localStorage).

```elixir
def handle_event("set_nickname", %{"nickname" => nickname}, socket) do
  if valid_nickname?(nickname) do
    {:reply, %{accepted: true}, assign(socket, :nickname, nickname)}
  else
    {:reply, %{accepted: false}, socket}
  end
end
```

## Lesson 2: Eventual Consistency

Distinguish between "empty" (not yet loaded) and "none" (definitively absent). On page load, show a loading indicator until data arrives from the cache, rather than displaying a default that flickers when the cached value arrives.

Sequence: empty state → loading indicator → receive cached value (or default) → ready for interaction.

```elixir
def mount(%{"room" => room}, _session, socket) do
  {:ok, assign(socket, :nickname, nil)}
end
```

## See also

- [Service Desk Application Schema and Architecture Design](../../projects/service-desk/schema-and-architecture-design.md)

> Source: inbox/articles/Love LiveView and think distributed systems.md · processed 2026-07-02
