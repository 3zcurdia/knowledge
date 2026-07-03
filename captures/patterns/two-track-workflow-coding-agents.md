# Two-Track Workflow for Coding Agents

A practical workflow using two agents in parallel: one for specifications, one for implementation. Built on the principle that human attention is the bottleneck, not agent count.

## The Two Tracks

### Spec Track (high human attention)

1. Brainstorm feature idea with the agent — it asks questions, reads the codebase, steps through requirements
2. Agent creates a technical design and implementation plan from the functional spec
3. Output: complete functional spec (PRD) + technical design + broken-down engineering tasks

The spec track requires continuous human attention. You cannot simply give the agent a feature name and expect a well-thought-out spec — the agent needs to ask questions, you answer, review, iterate.

### Implementation Track (low human attention)

1. Give the agent the spec and implementation plan
2. Agent works autonomously on implementation
3. Human reviews when tasks complete, or at the end

Unlike the spec track, the implementation agent has all the input it needs to work independently for a while. While it implements, you start the next spec.

## Why Only Two?

- **Spec track needs continuous attention** — hard to parallelize (can't write two specs simultaneously)
- **Specs are the bottleneck** — implementation agents can only go as fast as you provide inputs
- **Verification requires human touch** — code review, functional testing, UI iteration
- **You can't delegate UX** — building a great product is subjective and opinionated

## The Cycle

1. Start spec for feature A (high attention)
2. Hand spec to implementation agent (low attention)
3. Start spec for feature B while agent implements A
4. Review implementation of A, start next implementation
5. Repeat

## Target Audience

Mostly valuable for builders who hold product decisions and code simultaneously: solo devs, indie hackers, technical founders. Developers with a PM-provided spec can still benefit by creating technical designs in parallel with implementation.

## Theoretical Foundations

- **Theory of constraints**: a system can only go as fast as its bottleneck
- **Kanban**: "Stop starting, start finishing" — finish and review before starting more
- **Dual-Track Development**: popularized by Marty Cagan — spec and implementation as parallel tracks

## Tools Used

- [Tidewave](https://tidewave.ai/): agentic dev environment for Phoenix and Rails
- [Superpowers](https://github.com/obra/superpowers): agent skills for creating specs and implementation plans

> Source: inbox/articles/You don't need ten agents. You need two tracks..md · processed 2026-07-02
