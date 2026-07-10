# Loop Engineering: The Hype-Skepticism View

The "loop engineering" framing from Peter Steinberger is just the latest relabeling of an old idea. We already had context engineering. Before that, prompt engineering. Before that, the Ralph Loop. Agents are decent at verifiable tasks, but "getting something done" is not the same as "building good software" — and the engineering community is right to be tired of the new-term-per-quarter churn.

> Source: youtube.com/watch?v=J2ZE6XGCYb0 (Maximilian Schwarzmüller, 2026-06-09)

## The new hype term

A post by Peter Steinberger made the rounds: "Here's your monthly reminder that you shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents." Loop engineering, then, is the new name for the thing. Whether it becomes the official term depends on whether the industry lets it.

## The relabeling problem

The industry has been renaming the same idea on a regular cadence. Prompt engineering. Context engineering. Now loop engineering. They are not really different things — they are different framings of the same underlying problem: ensuring the model has the right context at the right moment so it has a better chance of producing the right output.

That is not a criticism of the technique. The technique is real. The criticism is of the rebrand. Every rebrand carries an implicit promise that the new name unlocks something the old name did not. It does not. The right context mattered before, matters now, and will matter after the next rename. Calling it loop engineering does not change the non-determinism, does not eliminate the failure modes, and does not turn the model into a senior engineer.

## We've been here before — the RALPH loop

At the turn from 2025 to 2026, the Ralph Loop had its moment. The pitch: write a detailed step-by-step task list, attach it to a Claude Code or Codex extension, and let the model grind through the list autonomously. Some people sold this as the way to ship software without a human in the loop.

Where is all that software? Where is the error-free, amazing autonomous output? Why is Claude Code still flickering through the same rough edges it had in January? The Ralph Loop shipped as a primitive into the same tools, and the result was... the same tools. The primitive is real. The promise of autonomous software production from a list was not.

## Agents are decent at verifiable tasks

The agents are good at one thing: tasks where the outcome is verifiable. Combine PDFs, ensure the final size is under a target, iterate until the check passes. The model can keep going, try different approaches, and converge. That part is genuinely useful and genuinely new in the agentic-coding era.

The trouble starts the moment the task is "build me good software." The model can verify whether the code compiles. It cannot verify whether the architecture is right, whether the abstractions will hold, whether the code is readable six months from now, whether the failure mode under load is graceful. Those are the things humans have spent decades learning to evaluate, and the model does not have a verifier for them.

## But "getting something done" is not building good software

"Getting something done" can mean anything. It can mean finding a way of doing something — for some use cases, that is enough. Software that should be distributed, evolved, and maintained is in a different category. The "way" the agent found might break the next time the input changes, the next time a corner case shows up, the next time a security audit lands. Software-as-a-product has different criteria from software-as-a-one-shot, and the agent does not know which it is in.

The reasons the industry settled on patterns, conventions, and review practices are not aesthetic. They are about extensibility, maintainability, performance, security, and understandability — and even if "the AI just needs to understand it, not a human," which is itself a bad take, the other parts still matter.

## The hype cycle frustration

The new-term churn is a sign of an industry that has not yet figured out what these tools are good for. People sell courses and products off each rename. Loop engineering will be the next one. Something else will come after. Eventually the dust will settle and the tools will be used for what they are useful for: helpful assistants that occasionally get the right answer and occasionally do not.

Until then, the right posture is: do not be the first to ship on a renamed primitive, do not be the last to use the underlying technique, and do not confuse a feature in a product for a fundamental shift in how software gets built.

## See also

- [Loop Engineering: Coding Agent Infrastructure](loop-engineering-agent-infrastructure.md)
- [AI Programming Boredom: The Passive Reviewer](ai-programming-boredom-passive-reviewer.md)

> Source: jarvis/01-captures/reactions/Here we go again... Loop Engineering.md · processed 2026-07-09
