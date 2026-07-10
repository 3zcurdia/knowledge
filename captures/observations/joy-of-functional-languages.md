# The Joy of Simpler Systems

Noticed how much I enjoy working with simpler systems — both personal side projects and Elixir. The thing that's different is the absence of hidden state changes within a function, and a peace of mind I cannot get from OOP languages, especially Ruby.

## The shift

Ruby has been my bread and butter for almost 20 years. My current project has a lot of unnecessary code in it, written to make it "cleaner" or "faster." The same logic in functional style, where data flows in and out of pure functions, reads top-to-bottom and stops hiding things from me. There is no `@instance_var` that another method mutates between my read and my decision. There is no `before_action` rewriting the params hash. The function is the unit, and the unit is honest.

## What I notice concretely

Three things stand out when I switch to functional code:

- **I trust my eyes.** Reading a function in Elixir tells me what it does. Reading the same logic in Ruby often tells me what it does *unless* a callback, a concern, or a method elsewhere mutates state first. The "unless" is the part that wears me down.
- **The "is this safe to refactor?" question goes quiet.** When the function has no hidden inputs, refactoring is a local operation. The blast radius is the function signature, not the entire object graph.
- **The test count drops.** A pure function needs fewer tests because it has no environment to mock. The same behavior in OOP demands doubles, stubs, and setup that obscures the intent of the test.

## The thought that lingers

Yeah, why not Elixir?

## See also

- [BEAM Outperforms MRI on Path Tracing](beam-outperforms-mri-path-tracing.md)
- [Simplified DDD with Elixir and Ecto](../patterns/simplified-ddd-elixir-ecto.md)
- [Elixir Testing Philosophy](../patterns/elixir-testing-philosophy.md)
- [InVision's Elixir Adoption](invision-elixir-adoption.md)

> Source: jarvis/01-captures/observations/The clarity of simpler systems.md · processed 2026-07-09
