---
name: process-inbox
description: |
  Triage and normalize exported conversations sitting in inbox/ into the categorized
  knowledge base. Reads inbox/chats/, inbox/agents/, and inbox/articles/, extracts substantive topics,
  rewrites each as a one-topic markdown file under the right category, and removes the
  source. Interactive: proposes title/category/filename per topic and asks before writing.
  Use ONLY when the working directory is the knowledge base root containing AGENTS.md and
  inbox/.   Fire when the user says "process inbox", "triage inbox", "process chats",
  "normalize inbox", or runs "/process-inbox".
user_invocable: true
---

# /process-inbox

Work through every file in `inbox/chats/`, `inbox/agents/`, and `inbox/articles/`, distilling each into one
or more normalized, one-topic markdown files routed to the correct category directory.
Interactive: every proposed output is shown for confirmation before it is written.

## Invocation

```
/process-inbox                 # process everything in inbox/
/process-inbox chats           # scope to inbox/chats/ only
/process-inbox agents           # scope to inbox/agents/ only
/process-inbox articles         # scope to inbox/articles/ only
/process-inbox foo.md          # scope to one filename
process inbox / triage inbox                      # natural-language triggers
```

---

## Step 0 — Scope guard

Verify the working directory is the knowledge base root. It must contain both `AGENTS.md`
and `inbox/`. If either is missing, stop and tell the user this skill only runs inside the
knowledge repo.

---

## Step 1 — Collect inbox files

Build the work list:

1. Search the requested scope (`inbox/chats/**`, `inbox/agents/**`, `inbox/articles/**`, or the whole `inbox/**`
   when no scope is given) for readable text files: `.md`, `.txt`, and extensionless text.
2. Exclude `.keep` and any dotfiles.
3. Sort alphabetically by path.

If the list is empty, print "Inbox is empty — nothing to process." and stop.

---

## Step 2 — Per-file loop

Process each source file in order. Within a file, there may be several distinct topics;
treat each as a separate output (the KB convention is one topic per file).

### 2a — Read & segment

Read the source. Delegate analysis to the `text-analyst` subagent for:
- **Topic segmentation**: identify distinct topics / conversational threads
- **Key idea extraction**: extract substantive content while stripping noise
- **Category suggestion**: get a suggested KB route for each topic

A single source may yield 0, 1, or many topics.

If the file is empty or contains nothing but noise (greetings, disclaimers, unresolved
chatter with no takeaway), mark it as **skip-no-content** and move on.

### 2b — Propose outputs

For each topic, compute:

- **Title**: concise, descriptive, in English.
- **Category**: one of the routes below, with a one-line rationale.
- **Filename**: kebab-case, `.md`, derived from the title (e.g. `api-rate-limit-quota.md`).
- **Destination**: `<category-dir>/<filename>`.
- **Body**: the normalized markdown (see Normalization rules).

Collision handling: if the destination path already exists, do not overwrite. Suffix the
filename with `-2`, `-3`, … until free. If a near-identical file already exists, offer to
skip instead of duplicating.

Directory creation: `mkdir -p` the destination directory before writing if it does not
exist (this matters for `projects/<name>/`).

### 2c — Confirm with the user

For each topic, display a block and wait for a choice:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Source : <source path>  (topic <i> of <n>)
Title  : <proposed title>
Route  : <category>  — <one-line rationale>
File   : <destination path>
┄┄┄ Preview (first ~20 lines) ┄┄┄
<normalized body head>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Choice menu:

```
1. Write as proposed
2. Edit            — change title, filename, or body
3. Recategorize    — pick a different route
4. Skip topic
5. Skip rest of file
```

Default (pressing enter) = `1 Write`.

### 2d — Write

On `Write` / `Edit` / `Recategorize` (after corrections), write the destination file with
the normalized body. Confirm the path was written, then continue to the next topic.

After every topic from a source file has been handled (written or skipped), apply the
source-deletion rule (see below).

---

## Step 3 — Progress & summary

After each source file, print `[<done>/<total> files done]`.

When the loop is complete, print a summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Done. Inbox processed.

  Files created:
    decisions/             : N
    captures/numbers/      : N
    captures/observations/ : N
    captures/patterns/     : N
    projects/              : N
    notes/                 : N
  Topics skipped           : N
  Sources deleted          : N
  Sources kept (all-skipped): N
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If no files were written at all, say so and remind the user the inbox is untouched.

---

## Categorization heuristics

Route each topic to exactly one destination based on what the content *is*, not where it
came from:

| Content signal                                                          | Route to                  |
| ----------------------------------------------------------------------- | ------------------------- |
| A choice between alternatives, with rationale / trade-offs (ADR-style)  | `decisions/`              |
| Metrics, quotas, figures, benchmarks, capacity limits, exact numbers    | `captures/numbers/`       |
| A factual finding about how something behaves or works (observed)       | `captures/observations/`  |
| A recurring approach, technique, best-practice, "how we do X"           | `captures/patterns/`      |
| Tied to a named project or initiative (and not a decision)              | `projects/<project>/`     |
| General reference, explanation, how-to (the default catch-all)          | `notes/`                  |

`captures/` subfolder definitions:

- **numbers/** — quantitative facts: metrics, quotas, limits, benchmarks, sizes.
- **observations/** — qualitative findings: behaviors, states, "we noticed that …".
- **patterns/** — reusable approaches: techniques, conventions, "how we handle …".

Precedence when a topic fits more than one row:

```
decisions/  >  projects/  >  captures/*  >  notes/
```

That is: a decision wins even if it mentions a project; a project-scoped non-decision
beats a generic capture; `notes/` is always the fallback.

If you cannot confidently route a topic, default to `notes/` and say so in the rationale
so the user can recategorize.

---

## Normalization rules

The body of every output file must follow the KB conventions (`AGENTS.md`):

- First line is a `# Title` heading matching the proposed title.
- One topic per file.
- Filenames are kebab-case.
- Language: keep English content as-is; translate non-English content to English.
- Cross-references: if the source references other KB topics, add a `## See also` section before the provenance footer.

Content shaping:

- Distill Q&A exchanges into declarative statements — keep the answer, drop the question
  chatter.
- Preserve **verbatim**: code blocks, shell commands, URLs, config snippets, exact values,
  identifiers.
- **Drop**: greetings, pleasantries, "as an AI", disclaimers, meta-commentary, redundant
  back-and-forth, and unresolved chitchat.
- A topic that is entirely unresolved questions with no takeaway is **skipped**, not filed.

Provenance footer: append a single line at the end of every written file:

```
> Source: <source path> · processed <YYYY-MM-DD>
```

This survives the source-file deletion and keeps the note traceable.

---

## Source-deletion rule

The inbox is a transient queue. After a source file has been fully processed (every topic
either written or explicitly skipped), delete it with `rm`:

- **Delete** if at least one topic from it was written.
- **Keep** if the user skipped every topic (they likely want to revisit). Print a note that
  it was retained.
- **Delete** skip-no-content files (empty / pure-noise) — they have no value to retain.

List every deleted source in the final summary.

---

## Edge cases

- **Non-markdown source** (`.txt`, extensionless): read it, still write the output as `.md`.
- **Very large file**: segment topic-by-topic; do not truncate a topic's preserved code/values.
- **Binary or unreadable file**: skip with a warning, do not delete.
- **Filename collision**: suffix `-2`, `-3`, … never overwrite an existing file.
- **Destination directory missing** (e.g. `projects/new-thing/`): `mkdir -p` it first.
- **Empty inbox**: report and stop; do not error.

---

## What this skill does NOT do

- Does not modify or move files already sitting in the categorized directories — only
  writes new files and deletes inbox sources.
- Does not push to git or commit; the user commits when they choose.
- Does not translate English content; translates non-English content to English.
- Does not auto-write without confirmation — every topic is shown first.
- Does not touch `.keep` files or dotfiles.

---

## Example invocations

```
/process-inbox
/process-inbox chats
/process-inbox agents
/process-inbox articles
/process-inbox 2026-07-02-standup.md
process inbox
triage inbox
```
