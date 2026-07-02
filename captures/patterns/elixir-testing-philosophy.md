# Elixir Testing Philosophy: Test What Matters

Testing in Elixir benefits from the tight feedback loop of IEx for prototyping, but ExUnit tests become inevitable for long-term maintainability. The key insight is to test contracts at module boundaries rather than implementation details.

## Key Principles

- **IEx is essential for spot-checking** — it's the tightest feedback loop available, but cannot be automated or serve as documentation.
- **ExUnit tests are executable documentation** — they capture how the system behaves so maintainers don't have to figure things out from scratch.
- **Trivial tests have negative ROI** — testing simple pure functions like `ttl/1` wastes time without reducing risk.
- **Private functions don't need direct tests** — if a private function feels complex enough to test, that's a design smell.
- **Integration tests matter most** — confidence at module boundaries implicitly validates the building blocks.
- **Coverage is not the goal** — 100% coverage is a vanity metric; what matters is testing where regressions are most likely and costly.
- **Tests age and rot** — prune them diligently as the codebase evolves.

## Two APIs: Public and Internal

Most libraries have two APIs: the public contract users depend on, and the internal API modules use to communicate with each other. ExUnit tests should guard the public-facing contract; internal correctness is implicitly validated by those tests.

## Testing as Design Feedback

If writing a test feels like pulling teeth, it's a sign the software design needs refactoring. Tests should feel natural; difficulty testing signals too many responsibilities in a function.

> Source: inbox/articles/Things I've realized about testing Elixir code.md · processed 2026-07-02
