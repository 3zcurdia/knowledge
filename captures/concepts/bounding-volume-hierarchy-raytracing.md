# Bounding Volume Hierarchy (BVH) for ray tracing

A **Bounding Volume Hierarchy (BVH)** is a tree of axis-aligned bounding boxes
(AABBs) built over the primitives in a scene. Each interior node stores a box
that tightly contains its children's boxes; the leaves hold the actual
primitives (e.g. spheres, triangles). Construction is a one-time cost at scene
setup; the tree is then queried per ray.

## How it accelerates intersection

For each ray, traversal visits a node only if the ray hits its bounding box
first — a cheap, branch-free slab test. If the ray misses the box, the entire
subtree is skipped without testing any of its children. Instead of testing the
ray against every primitive in the scene linearly, a ray touches on the order
of `log N` boxes on average, where `N` is the primitive count.

Concretely, a naive scene of `N` primitives costs **O(N) per ray**; a BVH
brings this to roughly **O(log N) per ray** for typical scenes.

## Why it matters

Ray tracers spend the vast majority of their time testing rays against
primitives that the ray ultimately misses. Even though each sphere-test is
cheap (a few multiplies and a square root), the aggregate cost dominates: a
single pixel samples the scene dozens or hundreds of times, and a 400x600
image at 50 samples per pixel is on the order of 10 million ray-sphere tests
even for a modest scene.

BVH is the single biggest algorithmic win in a path tracer for that reason: it
turns the dominant per-ray cost from linear to logarithmic, with no change to
the visual result.

## Construction

A typical BVH is built once at scene load time by:

- Picking a split axis (often the longest axis of the current node's bounding
  box).
- Sorting primitives by their centroid along that axis.
- Splitting at the median so the tree stays balanced.

This is `O(N log^2 N)` worst case, but it is amortized over the entire render
and is essentially free compared to per-pixel work. *Ray Tracing in One
Weekend* introduces a BVH as its final chapter precisely because it is the
biggest single speedup available without changing the rendering model.

## See also

- [Why BEAM (Elixir) outperforms MRI (Ruby) on path tracing](../observations/beam-outperforms-mri-path-tracing.md)

> Source: inbox/chats/session-ses_0b6d.md · processed 2026-07-09
