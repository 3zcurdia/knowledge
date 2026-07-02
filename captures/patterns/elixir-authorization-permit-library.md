# Authorization in Elixir with the Permit Library

The Permit library provides attribute-based access control (ABAC) for Elixir applications, with integrations for Ecto, Phoenix controllers, LiveView, and Absinthe.

## Authorization Paradigms

- **ACL:** Who can do what on what. O(1) lookups with ETS, but combinatorial explosion.
- **RBAC:** Roles → permissions. Auditable, but role creep with dozens of near-duplicates.
- **ABAC:** Action allowed if attribute conditions are met. Flexible but needs careful testing.
- **PBAC:** Policy-as-code (Bodyguard, Ash policies, OPA). Readable but steeper learning curve.

## Permit Architecture

Four libraries: base `permit`, `permit_ecto`, `permit_phoenix`, `permit_absinthe`. DSL-free syntax inspired by Ruby's CanCan, with only positive declarations (no `cannot`).

Permission definitions in a single module generate `read`, `create`, `update` etc. functions based on actions. Conditions are keyword lists; `can` constructs a permission check struct.

## Ecto Integration

Generates Ecto queries from conditions. `accessible_by` fetches only authorized records. Supports `ilike` syntax converted to regex for in-memory checks or SQL queries.

## Phoenix Integration

"Load and authorize" pattern: controller plugs load and authorize records before action handlers. Customizable `handle_unauthorized` callback (defaults to redirect). LiveView hooks into `handle_event` and `handle_params` on mount.

## ABAC as Universal Model

ACL, RBAC, and ReBAC are all reducible to Permit's ABAC model. Rules can be based on specific user IDs (ACL), roles (RBAC), or relationship entities (ReBAC).

> Source: inbox/articles/Authorization in Elixir Case Studies and the Permit Library.md · processed 2026-07-02
