# GenServer as the Owner of Agentic Workflow State

In BEAM/OTP agentic workflows the GenServer is not the AI agent — it is the process that owns and coordinates one execution of the workflow. One process per execution holds the state for that run, reacts to tool results, timeouts and cancellation requests as messages, and exits when the run is over. The central distinction: **the system has state; the model receives context derived from that state**. Because a GenServer handles one message at a time and the work in the loop is slow, the owner has to stay available and the slow work has to happen somewhere else.

## Chapter 1: State

I started reading about what makes agentic systems hard to build, expecting to find something wild and exotic to dig into. What I found instead was a list of problems that sounded pretty familiar:

- **State.**
- **Long-running processes.**
- **Communication.**
- **Concurrency.**
- **Coordination.**
- **Failure recovery.**

If you work with Elixir, Erlang, and the BEAM, it’s probably not new to you either.

The goal is to help you better understand agentic systems from the perspective of a BEAM developer. Not because OTP is an AI framework, nor because AI concepts map one-to-one to elements of the BEAM ecosystem, but because many of the engineering challenges these systems present are problems the BEAM community has been solving for decades.

So the question is simple:

What do I already know that can help me understand agentic workflows?

In this chapter, we start with the first item on the list: **state**.

## A familiar problem, a different way of approaching it

The example we’ll use throughout this chapter starts with a familiar situation: an endpoint that returns an error instead of the user’s data, and us leaning on an AI agent to debug and fix it.

```
GET /users/:id

Hey Claude: The GET /users/:id endpoint is returning a 500 error
for a valid ID. It should return the user object. Fix it.
```

Notice that the prompt describes what I want, not how to get there.

The agent takes this prompt as its **goal**. It has a codebase to investigate and a set of tools to do so. Let’s say it starts by inspecting the router and then the controller. What it does next depends on what it finds along the way.

One distinction matters for everything that follows. **The model at the center of the agent, a large language model (LLM), doesn’t open files or interact directly with the system.** It participates in deciding what should happen next, but it’s the tools that do the work, and their results become part of the context the model sees when it makes its next decision.

At a high level, we can represent it like this:

![OTP agentic workflow represent](https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_2000/https://www.erlang-solutions.com/wp-content/uploads/2026/10/image.png)

OTP agentic workflow represent

For this series, that’s our working definition of an **agentic workflow**: a workflow in which the model decides the path as it progresses, based on the context and on what it observes.

What interests us is everything behind that loop that makes it work as a system:

- Where we keep track of what has happened.
- Where the work runs.
- How the results come back.
- What work can happen concurrently.
- What happens when things fail.
- And finally, when the workflow stops.

We already know how to reason about those problems, and that’s what this series explores.

## The system needs to remember what happened

After a few iterations, the agent has gathered information: the controller function behind the endpoint, the tests, the relevant spots in the codebase. If every iteration had to start from scratch, it would never make any progress.

But from the model’s perspective, each invocation starts with only the context it’s given. The model itself doesn’t carry anything over from one invocation to the next.

That means the system around it must preserve information about the execution: the goal, what has already happened, what work is still pending, how many steps it has taken, and so on.

**In other words, the workflow has state.**

Before we continue, let’s define another concept we’ve already mentioned and will need throughout this series: **context**.

When the model needs to decide what to do next, it needs information about what has happened so far. Maybe the failing test output, the relevant function, the original goal, and the result of the last tool call. The model receives that information as context.

The two are related, but they’re not the same thing. One way to see it:

**The system has state. The model receives context derived from that state.**

The state usually contains more than the model needs for a particular decision. Step counts and pending work may matter to the system without needing to be exposed to the model. And the model can only take in a limited amount of context per invocation (what’s known as its context window), so even the relevant information may need to be selected, summarized, or trimmed.

What the model sees depends on the decision we’re asking it to make. This brings us to the first interesting question of the chapter.

## Who owns the state?

The answer is the essential building block of the BEAM world: **a process**.

A process owns its state. No other process can reach into its memory and change it; anyone who wants to interact with it has to send it a message. For a workflow, that suggests one process per execution: it starts when a goal comes in, holds the state for that run, and exits when the run is over.

But the process doesn’t just hold a value. It has to react to messages that arrive on their own schedule: a tool result, a timeout, a request to cancel.

A GenServer gives us exactly that. But be careful: the GenServer isn’t the AI agent. It’s just the process we’ll use to own and coordinate one execution of the workflow.

***A naming note:*** *agent in this series always means an AI agent, never Elixir’s* *Agent* *module. That module wouldn’t be enough here anyway: it’s a simple abstraction around state, built to hold a value, not to react to messages as they arrive.*

Before writing the process, let’s look at what it has to hold. Go back to our broken endpoint. The agent has already read the router, and the model’s next decision was to do two things at once: read the controller and run the tests. Neither has come back yet. At that moment, the state of the run looks like this:

```
%BlogOtp.Workflow{
  goal: "The GET /users/:id endpoint is returning a 500 error...",
  model: BlogOtp.Model.Scripted,
  history: [
    {{:read_file, %{path: "lib/my_app_web/router.ex"}},
     ~s(get "/users/:id", UserController, :show)}
  ],
  pending: %{
    #Reference<...> => {:read_file, %{path: "lib/my_app_web/controllers/user_controller.ex"}},
    #Reference<...> => {:run_tests, %{path: "test/my_app_web/controllers/user_controller_test.exs"}}
  },
  steps: 3,
  max_steps: 10
}
```

Each field maps to something we’ve already talked about:

- `goal` is the prompt we gave the agent.
- `model` is the module that makes the decisions. In this chapter it’s a scripted stand-in for an LLM, so it doesn’t need anything extra to run.
- `history` is what has happened so far: each tool call paired with its result.
- `pending` is the work requested but not answered yet. Each request gets a unique reference, so when a result arrives, we know which one it answers.
- `steps` counts the tool calls requested so far, and `max_steps` lets the system stop a run that goes on too long.

Only `goal` and `history` end up in the context. The rest exists for the system; the model never sees it.

Here’s the process that owns that state:

```
defmodule BlogOtp.Workflow do
  use GenServer, restart: :transient

  require Logger

  defstruct [:goal, :model, history: [], pending: %{}, steps: 0, max_steps: 10]

  def start_link(opts), do: GenServer.start_link(__MODULE__, opts)

  @impl true
  def init(opts) do
    state = %__MODULE__{
      goal: Keyword.fetch!(opts, :goal),
      model: Keyword.get(opts, :model, BlogOtp.Model.Scripted),
      max_steps: Keyword.get(opts, :max_steps, 10)
    }

    {:ok, state, {:continue, :next_step}}
  end

  @impl true
  def handle_continue(:next_step, state), do: next_step(state)

  @impl true
  def handle_info({:tool_result, ref, result}, state)
      when is_map_key(state.pending, ref) do
    {call, pending} = Map.pop(state.pending, ref)

    state = %{
      state
      | pending: pending,
        history: [{call, result} | state.history]
    }

    next_step(state)
  end

  # A result we aren't waiting for: a duplicate, or a late arrival
  def handle_info({:tool_result, _ref, _result}, state), do: {:noreply, state}

  # Still waiting on results: keep waiting
  defp next_step(%{pending: pending} = state) when map_size(pending) > 0,
    do: {:noreply, state}

  # The system decides when to stop, not only the model
  defp next_step(%{steps: steps, max_steps: max} = state) when steps >= max,
    do: finish({:stopped, :max_steps}, state)

  defp next_step(state) do
    # Chapter 1 shortcut: the owner calls the model itself
    case state.model.decide(build_context(state)) do
      {:tools, calls} -> {:noreply, request(calls, state)}
      {:done, answer} -> finish({:done, answer}, state)
    end
  end

  # Nobody executes these yet: each call waits in `pending` for its result
  defp request(calls, state) do
    Enum.reduce(calls, state, fn call, state ->
      %{state | pending: Map.put(state.pending, make_ref(), call), steps: state.steps + 1}
    end)
  end

  defp finish(outcome, state) do
    Logger.info("Workflow finished: #{inspect(outcome)}")
    {:stop, :normal, state}
  end

  # What the model gets to see, in its simplest form
  def build_context(state) do
    [{:goal, state.goal} | Enum.reverse(state.history)]
  end
end
```

The loop lives in `next_step/1`, which works like this:

- If results are still pending, it waits.
- If the run has gone on too long, it stops.
- Otherwise, it builds the context and asks the model what to do next: either more tool calls, which go into `pending`, or a final answer, which ends the process normally.

And `restart: :transient` tells a supervisor to restart the process only if it terminates abnormally: a run that finishes with `:normal` stays finished.

Two things are deliberately missing in this chapter. First, nobody executes the tools yet: requests sit in `pending` until someone sends back a `{:tool_result, ref, result}` message. Second, the owner calls the model directly, even though a model call is slow. Both are problems we’ll come back to.

The code also shows the state/context distinction from the previous section. `pending`, `steps` and `max_steps` exist for the system; the model never sees them. And the context is the output of `build_context/1`, a plain function over the state, so we can test what the model will see without calling a model.

## One message at a time

The code also gives us serialized access to the state.

Look at `pending ` in the example above. Suppose the controller’s contents and the test output come back at almost the same time. They arrive as messages, and the process handles them one at a time. Each `handle_info/2` runs to completion against a consistent state before the next message is processed. There are no locks; nothing else can change the state in the meantime, and the context for the next model call is never built from a half-applied update.

The first result is simply recorded: `pending` still holds the other request, so `next_step/1` keeps waiting. Only when the second result arrives does the model get to decide, with both observations in its context.

But that same property has a cost.

A GenServer handles one message at a time, and the work in this loop is slow: a model call can take seconds, while a test suite can take much longer. If the process did that work itself, it couldn’t handle anything in the meantime. Messages would pile up in its mailbox: a result, a timeout, a request to cancel, all waiting their turn.

And that’s exactly what our chapter 1 shortcut does with the model call. It works here because our scripted model answers instantly; a real one wouldn’t.

So owning the state and doing the work pull in opposite directions.

The owner process needs to stay available, so the work has to happen somewhere else. That’s why nobody executes the tools yet: the owner shouldn’t be the one doing it. We’ll come back to that.

First, there’s a more urgent question: everything above lives in memory.

## See also

- [Event Sourcing for Agentic Workflows](event-sourcing-for-agentic-workflows.md)
- [Restart Is Not Retry](../concepts/restart-is-not-retry.md)
- [Agentic Systems Are Just Database State and Processes](../observations/agentic-systems-database-state.md)
- [Agentic Workflows with Oban Pro: Cascades, Human-in-the-Loop, Grafting](oban-pro-agentic-workflows.md)

> Source: inbox/articles/Exploring OTP Patterns for Agentic Workflows.md · processed 2026-10-21
