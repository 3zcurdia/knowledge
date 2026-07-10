---
name: find-connections
description: |
  Surface non-obvious connections between recent captures across `captures/`. Time-bounded
  (default 7 days, configurable) so it runs cheaply on demand. Uses the Type A/B/C/D
  taxonomy borrowed from the jarvis weekly-connections skill: same principle, contradiction,
  3+ pattern, or accidental answer. Each connection is written to `notes/connections/`
  with a sibling `.json` RAG companion. Interactive: every proposed connection is shown
  for confirmation before it is written.
  Use ONLY when the working directory is the knowledge base root containing AGENTS.md.
  Fire when the user says "find connections", "weekly connections", "what connects",
  "find patterns", or runs "/find-connections".
user_invocable: true
---

# /find-connections

Mine recent captures for non-obvious relationships, then write each strong connection as a
synthesis note in `notes/connections/`. Time-bounded by default (7 days) so a session is
fast and idea-mining is the goal, not full dedup. For structural cleanup, run `/consolidate`
instead.

## Trigger phrases

"find connections" / "weekly connections" / "what connects" / "find patterns" / `/find-connections`

## Invocation

```
/find-connections                # default window: last 7 days
/find-connections 14d            # last 14 days
/find-connections 30d            # last 30 days
/find-connections all            # full history (overlaps with /consolidate — not recommended)
```

A bare integer is treated as days (`/find-connections 14` ≡ `/find-connections 14d`).

---

## Step 0 — Scope guard

Verify the working directory is the knowledge base root. It must contain `AGENTS.md`.
If missing, stop and tell the user this skill only runs inside the knowledge repo.

---

## Quality bar

If the connection is obvious it does not qualify. Only surface connections that would
genuinely surprise the person who wrote the notes. Push back on weak pairs instead of
padding the list. **Minimum 3 connections, maximum 5. Quality over quantity.** If you can't
find 3, say so — silence is better than filler.

---

## Step 1 — Collect recent captures

Build the work list. Walk `captures/**` for `.md` files whose mtime falls inside the
window. Skip `inbox/`, `.keep`, and dotfiles. Sort by path.

If fewer than 2 files are found, print "Need at least 2 recent captures — run
`/process-inbox` first." and stop.

Print `[N captures in the last <W> days]` before continuing.

---

## Step 2 — Detect connections (Type A/B/C/D)

Read each file's title and body. For each candidate pair or triple, classify the
relationship:

| Type | Definition                                                    |
| ---- | ------------------------------------------------------------- |
| A    | Same underlying principle in two different domains            |
| B    | Contradiction between two notes that creates interesting tension |
| C    | Pattern connecting three or more notes into one unnamed insight |
| D    | A question in one note that another note accidentally answers  |

For each qualifying connection, prepare:

- **Type** — one of A / B / C / D.
- **Bridge** — one sentence that names the relationship. If the bridge cannot be one
  sentence, the connection is not ready — skip it.
- **Hook** — a potential content hook using this connection (one line, concrete).
- **Sources** — the source file paths (relative to repo root, e.g.
  `captures/patterns/foo.md`).
- **Slug** — kebab-case, derived from the bridge, 3–7 words.

Stop at 5 findings. Never go beyond 5.

---

## Step 3 — Interactive review

For each finding, display a block and wait for a choice:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Finding [1/N]: TYPE <A|B|C|D>

  Bridge  : <one-sentence bridge>
  Hook    : <potential content hook>
  Sources : <path A>, <path B>, …
  File    : notes/connections/<YYYY-MM-DD>-<slug>.md
  JSON    : notes/connections/<YYYY-MM-DD>-<slug>.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Choice menu:

```
1. Save             — write the .md + .json pair
2. Edit             — change type, bridge, or hook
3. Skip finding
4. Skip rest        — stop processing findings
```

Default (pressing enter) = `1 Save`.

---

## Step 4 — Save behavior

On `Save` (or after `Edit` corrections), `mkdir -p notes/connections/` if missing, then
write the pair atomically.

Collision handling: if the destination `.md` already exists, suffix `-2`, `-3`, … until
free. The `.json` companion takes the same suffixed basename. The pair is atomic —
never write one without the other.

Write ordering: write the `.md` first. If the `.json` write fails after the `.md`
succeeded, leave the `.md` in place, warn the user, and continue.

### Markdown body shape

```markdown
# <bridge as title>

**Type:** <A|B|C|D> — <one-line description>

<one paragraph elaborating the connection in plain language>

## Hook

<one-line content hook>

## See also

- [Source A title](../../<path A>)
- [Source B title](../../<path B>)

> Source: synthesized from <path A>, <path B> · processed <YYYY-MM-DD>
```

### JSON companion (RAG indexer)

Schema mirrors `process-inbox`:

```json
{
  "id": "notes/connections/<YYYY-MM-DD>-<slug>",
  "path": "notes/connections/<YYYY-MM-DD>-<slug>.md",
  "title": "<the # Title, verbatim>",
  "category": "notes/connections",
  "type": "notes",
  "summary": "<one-paragraph retrieval-tuned abstract of the connection>",
  "keywords": ["<3–10 lowercase terms>"],
  "entities": ["<proper nouns / identifiers, verbatim>"],
  "see_also": ["<relative .md paths from See also, no link text>"],
  "source": "synthesized from <path A>, <path B>",
  "processed_at": "<YYYY-MM-DD>",
  "chunks": [
    {
      "section": "",
      "content": "<intro paragraph + Type line>"
    },
    {
      "section": "Hook",
      "content": "## Hook\n\n<hook text>"
    }
  ]
}
```

The `## See also` section and the provenance footer are **excluded** from `chunks` —
they are metadata, not retrievable content.

---

## Step 5 — Summary

After the loop, print:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Done. Connections processed.

  Window           : last <N> days
  Captures scanned : N
  Findings reviewed: N
  Saved            : N
  Skipped          : N
  Files created    : notes/connections/ : N (.md + .json)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If no findings were saved, say so and note that `notes/connections/` is unchanged.

---

## Categorization rules

| Type | When to use                                                    | Common failure mode         |
| ---- | -------------------------------------------------------------- | --------------------------- |
| A    | Two notes, two domains, one principle                          | Forcing a principle that isn't there |
| B    | Two notes that disagree — and the disagreement is the point    | "Both true" without tension |
| C    | Three or more notes that share an unstated structure           | Pair instead of a true triple |
| D    | Note A asks a question; note B answers it without trying to    | Reading too much into the question |

A pair is a Type A, B, or D. A pattern of three or more is a Type C. Never classify a
pair as C.

---

## Edge cases

- **Fewer than 2 recent captures**: report and stop; do not synthesize from a single note.
- **All findings skipped**: report and stop; do not write any files.
- **Window larger than the KB**: degrade gracefully — print the actual number of captures
  found and proceed if it's ≥ 2.
- **Connection note already exists for this bridge**: suffix the filename; do not
  overwrite.
- **Type ambiguity**: when a pair could be A or B, choose the type whose bridge is more
  falsifiable. If both are equally strong, prefer A (it generalizes better).
- **Empty `captures/`**: report and stop; do not error.

---

## What this skill does NOT do

- Does not modify files in `captures/`, `decisions/`, `projects/`, or `inbox/`.
- Does not run on `notes/` (other than writing to `notes/connections/`) or on `decisions/`
  or `projects/`. Its job is mining `captures/` for cross-file relationships.
- Does not run a full KB scan — use `/consolidate` for that.
- Does not push to git or commit; the user commits when they choose.
- Does not auto-save without confirmation — every finding is shown first.
- Does not generate embeddings — the JSON stays model-agnostic, same as `process-inbox`.
- Does not exceed 5 findings per run, even if more qualify.

---

## Example invocations

```
/find-connections                  # last 7 days, default
/find-connections 14d              # last 14 days
/find-connections 30d              # last 30 days
find connections                   # natural-language trigger
weekly connections                 # natural-language trigger
what connects                      # natural-language trigger
```
