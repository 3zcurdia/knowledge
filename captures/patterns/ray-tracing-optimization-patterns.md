# Ray Tracing Optimization Patterns (BVH + Parallelization)

## Scene Hit Testing (the main performance divider)

**Ruby** (`world.rb` via `HittableList#hit?`): Linear scan over all objects — O(N) per ray.
For ~500 spheres at 100 spp × 400 × 225 pixels × 50 bounces = **~225 billion hit tests**,
each doing a full linear scan.

**Elixir** (`hittable_list.ex`): Eagerly builds a **Bounding Volume Hierarchy** on construction.
```elixir
def new(objects \\ []) do
  %__MODULE__{objects: objects, bvh: BVHNode.build(objects)}
end
```

Hit tests become O(log N) via `BVHNode` which prunes subtrees using AABB slab-method
intersection (`aabb.ex:92-125`). This is the single largest optimization — ~19× improvement
on top of the parallel baseline.

**Ruby has no BVH**. This is the biggest missed optimization, but not surprising for a
reference implementation — the book introduces BVH in the second weekend.

## Parallelization

**Ruby**: Strictly sequential. The `render` method iterates `(height-1).downto(0)` with
nested `(0..width-1).each`, one pixel at a time. The README jokes about "55 frames per
fortnight."

**Elixir**: Three levels of parallelism tested:

1. **Per-line** (`Task.async_stream` over rows with `ordered: true`) — 42m → 2m56s (14×)
2. **Per-tile** (`Task.async_stream` over 64×64 tiles with `ordered: false`,
   `max_demand: System.schedulers_online()`) — similar speed, 13% less scheduler pressure
3. **Nx/EXLA** (batched tensor kernels) — inconclusive, slower than tile-based scalar

The tile version uses an Erlang `:array` as a concurrent write buffer:
```elixir
Enum.reduce(tiles, {:array.new(size: w*h)}, fn {:ok, entries}, {done, buf} ->
  Enum.reduce(entries, buf, fn {idx, str}, acc -> :array.set(idx, str, acc) end)
end)
```
This allows tasks to complete in any order without locks.

## Image Output

**Ruby**: Opens a file at construction, writes PPM header, appends each pixel as it renders,
then closes. This means a partially rendered image is viewable, but I/O interleaves with
computation.

**Elixir** (scalar path): Builds a complete list of pixel strings in memory, then writes
everything at once via `PPM.write/2`. The tile path writes into an `:array` buffer during
rendering, converts to list, then writes.

> Source: inbox/agents/exray-report.md · processed 2026-07-11
