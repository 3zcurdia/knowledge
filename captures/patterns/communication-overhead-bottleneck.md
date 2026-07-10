# Communication Overhead Is the Real Bottleneck

AI makes developers write code faster, but software's real bottleneck has always been communication overhead that scales quadratically with team size. This is why small teams consistently outperform large corporations regardless of tooling.

## The pattern

Coding speed is not the bottleneck. Communication is.

When team size grows, the number of communication channels grows faster than the team. With `n` engineers there are up to `n × (n-1) / 2` pairwise channels. A team of 4 has 6 channels; a team of 12 has 66; a team of 50 has 1,225. The growth is polynomial in n, not linear. Adding a tenth engineer to a five-person team roughly doubles the communication surface, not the headcount.

This is why small teams ship. They have fewer meetings, fewer handoffs, fewer sync points, fewer stakeholders to align. Their coordination cost is small, so almost all of their effort turns into output.

## Why AI does not change the math

AI coding tools increase the rate at which an individual engineer can produce code. That is the variable on the left side of the productivity equation. The variable on the right side — coordination, alignment, review, integration, deployment — does not change, or changes much less.

If a team's bottleneck was coding speed, AI is transformative. If a team's bottleneck was communication (and for most non-trivial teams, it is), AI is incremental: the team writes code faster and then spends the same time arguing about what the code should do, who owns which piece, and how to merge it.

## The implication for team design

The compounding lever is not the throughput of an individual engineer. It is the cost of coordination across the team. The things that move that needle:

- **Smaller, sharper scope.** A small team with a narrow product surface spends almost no time on inter-team handoffs. Most startup wins come from this, not from individual heroics.
- **Clear ownership boundaries.** A modular architecture with one team per module has fewer cross-team dependencies. The architecture is the organization.
- **Decision-making latency.** A team that can decide and ship in a day will beat a team that can decide and ship in a week, regardless of how much code each engineer writes per day. The ratio of decision time to coding time is the relevant metric.

## See also

- [Conway's Law](../concepts/conways-law.md)

> Source: jarvis/01-captures/patterns/Communication overhead is the real bottleneck not coding speed.md · processed 2026-07-09
