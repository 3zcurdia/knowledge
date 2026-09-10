# Language Paradigm Patterns in Ray Tracing Implementations

## Vector/Point Model

**Ruby** (`vector3d.rb`, `point.rb`):
```ruby
class Vector3D
  def initialize(x = 0.0, y = 0.0, z = 0.0)
    @x = x.to_f; @y = y.to_f; @z = z.to_f
  end
  def +(other)  = self.class.new(x + other.x, y + other.y, z + other.z)
  def *(other)  = ...  # scalar or vector
  def dot(other) = x*other.x + y*other.y + z*other.z
end
class Point < Vector3D; end         # Point is-a Vector3D
class Color < Vector3D              # Color is-a Vector3D
  alias r x; alias g y; alias b z
end
```

**Elixir** (`vector.ex`, `color.ex`):
```elixir
defmodule Exray.Vector do
  defstruct [:x, :y, :z]
  def add(a, b), do: %__MODULE__{x: a.x + b.x, y: a.y + b.y, z: a.z + b.z}
  def dot(a, b), do: a.x * b.x + a.y * b.y + a.z * b.z
end
defmodule Exray.Color do
  defstruct [:r, :g, :b]            # independent struct, no inheritance
end
```

**Key difference**: Ruby uses inheritance (`Point < Vector3D`, `Color < Vector3D`) to share all vector arithmetic. Elixir keeps `Vector` and `Color` as independent structs — `Color` has its own operations (`add`, `multiply`, `to_ppm_string`) and converts from/to `Vector` only when needed (e.g., `Color.new(%Vector{})`).

**Impact**: Ruby's approach means `Color * Color` reuses `Vector3D#*` for component-wise multiplication, but every operation allocates a new object. Elixir's approach is more explicit; function calls versus operator overloads have negligible performance difference.

## Polymorphism Strategy

**Ruby**: Class inheritance with duck typing.
```ruby
class Sphere < Hittable
  def hit?(ray, t_min, t_max, hit_record)
    # ... quadratic solve, mutate hit_record
  end
end

class HittableList
  def hit?(ray, t_min, t_max, hit_record)
    objects.each do |object|
      next unless object.hit?(ray, t_min, t_max, temp_record)
      # ...
    end
  end
end
```

**Elixir**: Protocols (the functional equivalent of type-classes).
```elixir
defprotocol Exray.Hittable do
  def hit(hittable, ray, t_min, t_max)
  def bounding_box(hittable)
end

defimpl Exray.Hittable, for: Exray.Sphere do
  def hit(%Sphere{} = sphere, %Ray{} = ray, t_min, t_max) do
    # ... quadratic solve, return {:ok, record} | :miss
  end
end

defimpl Exray.Hittable, for: Exray.BVHNode do ... end
defimpl Exray.Hittable, for: Exray.HittableList do ... end
```

**Impact**: Ruby's approach mutates a shared `HitRecord` object passed by reference. Elixir's protocol dispatches on type and returns immutable tuples. This makes the Elixir code inherently thread-safe — critical for the per-tile parallelization.

## Mutation vs Immutability

**Ruby's mutable hit flow** (in `sphere.rb` `hit?`):
```ruby
hit_record.t        = root        # mutate in-place
hit_record.point    = ray.at(hit_record.t)
hit_record.material = material
outward_normal = (hit_record.point - center) / radius
hit_record.set_face_normal(ray, outward_normal)
true
```

The caller (`HittableList#hit?`) passes a `HitRecord` that gets mutated, then copies fields into its own record. The material's `scatter?` also reads and mutates `@scattered`/`@attenuation` instance variables.

**Elixir's immutable hit flow** (in `sphere.ex`):
```elixir
defp nearest_hit(near_root, far_root, ray, center, radius, material, t_min, t_max) do
  cond do
    ray_in_bounds?(near_root, t_min, t_max) -> build_record(near_root, ray, center, radius, material)
    ray_in_bounds?(far_root, t_min, t_max) -> build_record(far_root, ray, center, radius, material)
    true -> :miss
  end
end

defp build_record(root, ray, center, radius, material) do
  point = Ray.at(ray, root)
  outward_normal = Vector.divide(Vector.subtract(point, center), radius)
  {:ok, HitRecord.new |> HitRecord.set_face_normal(ray, outward_normal) |> Map.put(:t, root) |> Map.put(:material, material)}
end
```

**Impact**: Ruby's mutation avoids intermediate allocations but makes parallelization unsafe without locks. Elixir allocates more structs per bounce, but immutability means zero shared-state overhead when distributing tiles across cores. This is a major factor in Elixir's ability to scale from 42 min → 9 sec with no synchronization primitives.

## Material Protocol

**Ruby** (`base_material.rb`):
```ruby
class BaseMaterial
  def scatter?(*_args)
    raise NotImplementedError
  end
  private
  def reflect(v, n)  = v - (n * v.dot(n)) * 2
  def refract(...)   = ...
  def reflectance(...) = ...
end
```

Materials set `@scattered` and `@attenuation` as side effects, then the caller reads them:
```ruby
if hit_record.material.scatter?(ray, hit_record)
  return ray_color(hit_record.material.scattered, depth - 1) * hit_record.material.attenuation
end
```

**Elixir** (`material.ex` protocol):
```elixir
defprotocol Exray.Material do
  def scatter(material, ray_in, record)
end
```

Materials return tuples:
```elixir
# Lambertian:
def scatter(%Lambertian{albedo: albedo}, _ray_in, record) do
  scatter_direction = Vector.add(record.normal, Vector.random_unit_vector())
  {:ok, Ray.new(record.point, scatter_direction), albedo}
end

# Dielectric:
def scatter(%Dielectric{index_of_refraction: ior}, ray_in, record) do
  # ...
  {:ok, Ray.new(record.point, direction), Color.white()}
end
```

**Impact**: Ruby's side-effect-based scatter means the caller must read `@scattered` and `@attenuation` after calling `scatter?`. The Elixir protocol returns a unified `{:ok, ray, attenuation}` or `:absorbed`, which is more explicit and composes naturally with pattern matching.

## Scene Hit Testing

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

## See also

- [Bounding Volume Hierarchy (BVH) for ray tracing](../concepts/bounding-volume-hierarchy-raytracing.md)
- [Ray Tracing Performance Benchmarks — Ruby vs Elixir](../numbers/ray-tracing-performance-benchmarks.md)

> Source: inbox/agents/exray-report.md · processed 2026-07-11
> Merged: captures/patterns/ray-tracing-optimization-patterns.md · 2026-09-09
