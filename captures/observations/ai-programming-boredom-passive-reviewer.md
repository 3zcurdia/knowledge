# AI Programming Boredom: The Passive Reviewer

Using AI for coding is eliminating the challenge from the work. There is nothing to learn, nothing to actively do — just prompt, review, confirm. Programming joy has become boredom, and the role has shifted from active implementer to passive reviewer. The honest need: I need some challenge back.

## The problem

Three observations that all point at the same shift:

- **Active implementer → passive reviewer.** The work that used to be mine (design the function, write the code, debug the failure) is now a prompt followed by a review. The hands-on phase is shrinking.
- **Joy has evaporated.** Programming was a craft with feedback loops you could feel. The replace-loop is now: prompt, receive, evaluate, accept or reject. There is no muscle memory getting built because no muscles are moving.
- **Boredom breeds disengagement.** When the day is "ask the LLM, read what came back, ask again," the temptation to let the loop run itself in autonomous mode is strong. Letting it run is exactly the failure mode — now I am not even reading the output.

## The personal reflection (Boredom from IA)

> "I was never considered myself one of the top performers in any work in the past years. I never feel like I'm the fastest person on the team working or typing. I'm more like a thoughtful engineer. Things move a little more slowly because I'm more into optimizing and code quality. And now the perspective has changed — it has shifted from being an active implementer, even though without competition with AI, I have this feeling that I had control of what I want to be the output. Nowadays with all this agentic workflow, it's like I should keep asking Claude Code or Codex or whatever the tool is to do something and then read what they implemented. Sometimes it's good. Sometimes it's bad. Sometimes I find something where I think 'hey, I would not be doing it that way, I would be doing the other way, please fix it.' And that's it."
>
> "There are people saying engineers are turning into architects. I'm not sure, but on this part of my work it feels more boring. I'm just prompting, reviewing what it's doing, then reviewing the output and correcting with the AI and so on. That has led me to some boredom recently. I found myself a lack of motivation for what I'm doing. It's like yeah, just ask the AI and the LLM will respond."
>
> "I have a confession to make: other than this past week, I've spent more time playing video games than actually working. Because my job was just review, click, click, click. Next, next, next. Or even not clicking, just leaving in autonomous mode: do whatever you need to do, and when you're done I'll review. That is quite frustrating in its entirety."

The strongest line: the posture of the engineer becomes the posture of the manager. And the manager of an agent is not the same job as the engineer of the code. Some people will love the new job. Many will discover, after the relief wears off, that they miss the work.

## The 30-minute debugging anecdote

A counterexample, with a concrete data point.

Yesterday, an attempt to debug an LLM-related issue inside Claude Code burned hours and a lot of "thinking" tokens. The LLM's proposed solution was ineffective.

Today, sitting down to read the issue carefully and work it out manually, the same problem was solved in 30 minutes. The manual solution was also better, because the engineer learned the underlying mechanism along the way.

> "If the AI solves it for me, I did not gain the learning from today, and probably the solution will not be better."

The non-obvious lesson: the cost of using AI for debugging is not just the tokens or the time. It is the missed learning, which is the asset that compounds across the next ten years of debugging. The 30 minutes is not expensive. The not-learning is.

## What I keep coming back to

Maybe this past decade and a half has some value after all.

The honest take: I prefer to use dumber models and accept they might be wrong and fix it, than to expect that the complex larger models catch up with human intelligence and surpass my abilities. The slower path keeps me in the loop. The faster path takes me out of it, and once I am out, the things I used to be good at start to atrophy.

Is there a better way to work with AI? Probably. The patterns that point at one: stay in the spec loop, not the implementation loop; verify every claim the agent makes about its own work; reserve the boring parts for the agent and keep the hard parts for the hands. None of these recover the old joy fully, but they all push back against the passive-reviewer posture.

## See also

- [Loop Engineering: Coding Agent Infrastructure](loop-engineering-agent-infrastructure.md)
- [Two-Track Workflow for Coding Agents](../patterns/two-track-workflow-coding-agents.md)

> Source: jarvis/01-captures/observations/Why AI programming feels boring.md + jarvis/01-captures/reactions/Boredom from IA.md + jarvis/01-captures/reactions/Where to be creative?.md · processed 2026-07-09
