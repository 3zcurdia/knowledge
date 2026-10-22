# Restart Is Not Retry

Rebuilding a workflow's state and re-executing the work that state describes are two separate problems. A restart gives the process back the ability to continue the workflow; it says nothing about whether an external action should run again. The log records that a *decision* was made, never that the *effect* of that decision completed — and for actions like opening a pull request, inserting a database row that must never exist twice, or charging a customer, replaying them is not a safe default.

## Rebuilding isn’t resuming

Fold the log from our crash, and `pending` holds exactly one entry: step 3.

`Run the tests`

There’s no result for it. So `next_step/1` sees something pending and waits, for a result that may never come.

We know the decision was recorded. But did the work actually run? Maybe the request was never sent. Maybe the tests were still running when the process crashed. Maybe they finished, and the result was lost before it could be recorded.

For a test suite, running it again is harmless. But imagine our agent’s last step had been:

`Open a pull request`

Now repeating it means a duplicate pull request. And some actions are even more delicate than that, like inserting a row into a database that must never exist twice, or charging a customer. Those are the ones where we have to be really careful.

Restarting the process gives us back the ability to continue the workflow. It doesn’t tell us whether to run an external action again.

**Restart and retry are two different problems.**

That leaves two questions open: where the work actually happens while the owner stays available, and what to do with a step whose outcome we don’t know. The first question is where the next chapter picks up. The second one will have to wait until we talk about failure recovery.

## See also

- [Event Sourcing for Agentic Workflows](../patterns/event-sourcing-for-agentic-workflows.md)
- [GenServer as the Owner of Agentic Workflow State](../patterns/genserver-owns-agentic-workflow-state.md)
- [Agentic Systems Are Just Database State and Processes](../observations/agentic-systems-database-state.md)

> Source: inbox/articles/Exploring OTP Patterns for Agentic Workflows.md · processed 2026-10-21
