# Loop Engineering: Coding Agent Infrastructure

Loop engineering is replacing yourself as the person who prompts the agent. You design the system that does it instead. A loop is a recursive goal — you define a purpose and the AI iterates until complete. It's roughly five building blocks, and Claude Code and Codex both have all five now.

> Source: x.com/addyosmani/status/2064127981161959567 (Addy Osmani, 2026-06-08)

## The shift

For like two years, the way you got something out of a coding agent was you wrote a good prompt and shared enough context. You type a thing, you read what came back, you type the next thing. The agent is a tool, and you are holding it the entire time, one turn after the other. That part is kind of over, or at least some think it is going to be.

Now you build a small system that finds the work, hands it out, checks it, writes down what is done, and then decides the next thing — and you let that system poke the agents instead of you. Loop engineering sits one floor above the harness. The harness runs on a timer, it spawns little helpers, and it feeds itself.

A year ago, if you wanted a loop you wrote a pile of bash and you maintained that pile forever, and it was yours and only yours. Now the pieces just ship inside the products. Once you notice the shape is the same, you stop arguing about which tool, you just design a loop that still works no matter which one you happen to be sitting in.

The thing that surprised the original author is this is not really a tool thing anymore. The capability moved into the products.

## The five building blocks

A loop needs five things, plus one place to remember stuff:

1. **Automations** — go off on a schedule and do discovery and triage by themselves.
2. **Worktrees** — so two agents working in parallel do not step on each other.
3. **Skills** — write down the project knowledge the agent would otherwise just guess.
4. **Plugins and connectors** — plug the agent into the tools you already use.
5. **Sub-agents** — so one of them has the idea and a different one checks it.

The sixth thing, the memory: a markdown file, or a Linear board, anything that lives outside the single conversation and holds what is done and what is next. Sounds too dumb to matter. But it is the same trick every long-running agent depends on — the model forgets everything between runs, so the memory has to be on disk and not in the context. The agent forgets; the repo does not.

Both Claude Code and Codex have all five now. The names differ here and there but the capability is the same.

## Automations — the heartbeat

Automations are what make a loop an actual loop and not just one run you did once. In Codex, you make one in the Automations tab and you pick the project, the prompt it will run, how often, and whether it runs on your local checkout or on a background worktree. Runs that find something go to a Triage inbox; runs that find nothing archive themselves. You can have an automation call a skill, so you keep the recurring thing maintainable.

Claude Code gets to the same place but through scheduling and hooks. You can run a prompt or a command on an interval with `/loop`, schedule a cron task, fire shell commands at certain points in the agent lifecycle with hooks, or push the whole thing to GitHub Actions if you want it to keep running after you close the laptop. Same idea exactly — you define an autonomous task, give it a cadence, and the findings come to you so you are not the one going around checking.

A second in-session primitive is worth knowing: `/loop` re-runs on a cadence. `/goal` keeps going until a condition you wrote is actually true, and after every turn a separate small model checks whether you are done, so the agent that wrote the code is not the one grading it. Codex has the same thing, also called `/goal`.

## Worktrees — parallel without chaos

The second you run more than one agent, the files start colliding. Two agents writing the same file is the exact same headache as two engineers committing to the same lines and nobody talked to each other first. A git worktree fixes it: a separate working directory on its own branch sharing the same repo history, so one agent's edits literally cannot touch the other agent's checkout.

Codex builds the worktree support right in so several threads hit the same repo at once and do not bump into each other. Claude Code gives you the same isolation with git worktree, a `--worktree` flag to open a session in its own checkout, and an `isolation: worktree` setting you stick on a subagent so each helper gets a fresh checkout that cleans itself up after. The worktrees take away the mechanical collision — but *you* are still the ceiling, because your review bandwidth decides how many you can actually run, not the tool.

## Skills — stop explaining your project every time

A skill is how you stop re-explaining the same project context every session like a goldfish. Both tools use the same format — a folder with a `SKILL.md` inside holding instructions and metadata, and then optional scripts, references, and assets. Codex runs a skill when you call it with `$skill-name` or `/skills`, or by itself when your task matches the skill description. Claude Code does it the same way.

Skills are also where intent stops costing you over and over. An agent starts every session cold, and it will fill any hole in your intent with a confident guess. A skill is that intent written down on the outside — the conventions, the build steps, the "we don't do it like this because of that one incident" — written one time where the agent reads it every run. Without skills the loop re-derives your whole project from zero every cycle; with skills it kind of compounds.

One thing to keep straight: the skill is the authoring format, and a plugin is how you ship it. When you want to share a skill across repos or bundle a few together, you package them as a plugin. True in Codex, true in Claude Code.

## Plugins and connectors — the loop touches your real tools

A loop that can only see the filesystem is a tiny loop. Connectors, which are built on MCP, let the agent read your issue tracker, query a database, hit a staging API, drop a message in Slack. Both Codex and Claude Code speak MCP, so the connector you wrote for one usually just works in the other. Plugins bundle connectors and skills together so your teammate installs your setup in one go instead of rebuilding the whole thing from memory.

This is the difference between an agent that says "here is the fix" and a loop that opens the PR, links the Linear ticket, and pings the channel once CI is green by itself. The connectors are the reason the loop can act inside your actual environment instead of just telling you what it would do if it could.

## Sub-agents — keep the maker away from the checker

The most useful structural thing in a loop, by far, is splitting the one who writes from the one who checks. The model that wrote the code is way too nice grading its own homework. A second agent with different instructions, and sometimes a different model, catches the stuff the first one talked itself into.

Codex only spawns subagents when you ask, runs them at the same time, and folds the results back into one answer. You define your own agents as TOML files in `.codex/agents/`, each with a name, a description, instructions, and optional model and reasoning effort — so your security reviewer can be a strong model on high effort while your explorer is some fast read-only thing. Claude Code does the same with subagents in `.claude/agents/` and agent teams that pass work between them. The usual split in both is one agent explores, one implements, one verifies against the spec.

The reason it matters specifically inside a loop is the loop runs while you are not watching, so a verifier you actually trust is the only reason you can walk away. Sub-agents do burn more tokens since each one does its own model and tool work, so spend them where a second opinion is worth paying for.

## What one loop looks like

An automation runs every morning on the repo. Its prompt calls a triage skill that reads yesterday's CI failures, the open issues, the recent commits, and writes the findings into a markdown file or a Linear board. For each finding worth doing, the thread opens an isolated worktree and sends a sub-agent to draft the fix, and a second sub-agent reviews that draft against the project skills and the existing tests.

Connectors let the loop open the PR and update the ticket. Anything the loop cannot handle lands in the triage inbox for a human. The state file is the spine of the whole thing — it remembers what got tried, what passed, what is still open, so tomorrow morning's run picks up where today stopped.

## What the loop still does not do for you

The loop changes the work; it does not delete you from it. Three problems get sharper as the loop gets better, not easier.

**Verification is still on you.** A loop running unattended is also a loop making mistakes unattended. The whole reason you split the verifier sub-agent from the maker is to make the loop's "it's done" mean something, and even then "done" is a claim and not a proof. Your job is to ship code you confirmed works.

**Your understanding still rots if you allow it.** The faster the loop ships code you did not write, the bigger the gap between what exists and what you actually get. That is comprehension debt, and a smooth loop just makes it grow faster unless you read what the loop made.

**The comfortable posture is probably the risky one.** When the loop runs itself, it is very tempting to stop having an opinion and just take whatever it gives back. That is cognitive surrender. Designing the loop is the cure when you do it with judgment, and the accelerant when you do it to avoid thinking — same action, opposite result.

## Build the loop. Stay the engineer

Two people can build the exact same loop and get completely opposite results. One uses it to move faster on work they understand deeply. The other uses it to avoid understanding the work at all. The loop does not know the difference. You do.

That is what makes loop design harder than prompt engineering, not easier. The leverage point moved; the work did not get easier.

## See also

- [Two-Track Workflow for Coding Agents](../patterns/two-track-workflow-coding-agents.md)
- [Loop Engineering: The Hype-Skepticism View](loop-engineering-hype-skepticism.md)
- [AI Programming Boredom: The Passive Reviewer](ai-programming-boredom-passive-reviewer.md)

> Source: jarvis/01-captures/observations/Loop Engineering.md · processed 2026-07-09
