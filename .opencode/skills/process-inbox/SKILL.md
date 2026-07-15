---
name: process-inbox
description: |
  Triage and normalize exported conversations and papers sitting in inbox/ into the
  categorized knowledge base. Reads inbox/chats/, inbox/agents/, inbox/articles/, and
  inbox/papers/, extracts substantive topics, and rewrites each as a one-topic markdown
  file under the right category, paired with a sibling .json structured-data file that
  a RAG indexer consumes. Removes the source. For papers, also extracts the abstract,
  conclusion, and all quantitative data/metrics.
  Interactive: proposes title/category/filename per topic and asks before writing.
  Use ONLY when the working directory is the knowledge base root containing AGENTS.md and
  inbox/.   Fire when the user says "process inbox", "triage inbox", "process chats",
  "process papers", "normalize inbox", or runs "/process-inbox".
user_invocable: true
---

# /process-inbox

Work through every file in `inbox/chats/`, `inbox/agents/`, `inbox/articles/`, and
`inbox/papers/`, distilling each into one or more normalized, one-topic markdown files
routed to the correct category directory. Papers get special handling: the abstract,
conclusion, and all quantitative data are extracted and structured separately.
Each markdown file is paired with a sibling `.json` structured-data file that a RAG
indexer consumes for retrieval (summary, keywords, section-level chunks). Interactive:
every proposed output pair is shown for confirmation before it is written.

## Trigger phrases

"process inbox" / "triage inbox" / "process chats" / "process papers" / "normalize inbox" / `/process-inbox`

## Invocation

```
/process-inbox                 # process everything in inbox/
/process-inbox chats           # scope to inbox/chats/ only
/process-inbox agents           # scope to inbox/agents/ only
/process-inbox articles         # scope to inbox/articles/ only
/process-inbox papers           # scope to inbox/papers/ only
/process-inbox foo.md          # scope to one filename
process inbox / triage inbox / process papers      # natural-language triggers
```

---

## Step 0 — Scope guard

Verify the working directory is the knowledge base root. It must contain both `AGENTS.md`
and `inbox/`. If either is missing, stop and tell the user this skill only runs inside the
knowledge repo.

---

## Quality bar

Distill, don't transcribe. Drop greetings, disclaimers, "as an AI" lines, and unresolved
chitchat. A topic that is entirely unresolved questions with no takeaway is skipped, not
filed. If you find yourself rewriting the source instead of restructuring it, stop — you
are summarizing, not normalizing. Preserve code, commands, URLs, and exact values verbatim.

---

## Tag convention

Every written output carries **exactly three tags** — no more, no fewer. Tags are lowercase
frontmatter-style identifiers that filter retrieval (e.g. `["glm-5.2", "benchmark", "pricing"]`).
Favor specific tokens over generic words; `"ai"` is too broad, `"claude-code"` is too narrow.
Tags are surfaced in the interactive prompt and may be edited before Write.

---

## Step 0.5 — PDF preprocessing

If there are `.pdf` files anywhere in `inbox/`, automatically run:

```bash
scripts/preprocess-pdfs
```

This extracts text from every PDF into a sibling `.md` file and deletes the source PDF on
success. After it finishes, continue to Step 1; the newly created `.md` files will be picked
up automatically.

---

## Step 1 — Collect inbox files

Build the work list. Scan the requested scope (`inbox/chats/**`, `inbox/agents/**`,
`inbox/articles/**`, `inbox/papers/**`, or the whole `inbox/**`) for `.md`, `.txt`, and
extensionless text. Skip `.keep`, dotfiles, and `.pdf` (handled in Step 0.5). Sort by path.

If the list is empty, print "Inbox is empty — nothing to process." and stop.

---

## Step 2 — Per-file loop

Process each source file in order. Within a file, there may be several distinct topics;
treat each as a separate output (the KB convention is one topic per file).

### 2a — Read & segment

Read the source. Delegate analysis to the `text-analyst` subagent. For each topic the
subagent must return all of:

- **Topic segmentation**: identify distinct topics / conversational threads
- **Key idea extraction**: extract substantive content while stripping noise
- **Category suggestion**: a suggested KB route (one of the routes in Categorization
  heuristics) for each topic
- **Summary**: a one-paragraph retrieval-tuned abstract of the topic. This is *not* a
  copy of the markdown intro — it should be written to maximize semantic match for the
  kinds of questions a RAG reader would ask about this topic. Keep under ~120 words.
- **Keywords**: a list of 3–10 lowercase terms useful as retrieval filters (e.g.
  `["glm-5.2", "benchmark", "pricing"]`). Favor specific tokens over generic words.
- **Entities**: a list of proper nouns / product names / identifiers as they appear
  verbatim in the body (e.g. `["GLM-5.2", "Claude Opus 4.8"]`).
- **Chunks**: the normalized body split into `## ` sections. Each chunk is an object
  `{ "section": "<H2 heading text>", "content": "<section body verbatim>" }` where
  `content` includes the `## ` line and everything up to the next `## ` (or end of the
  body, excluding the `## See also` section and the provenance footer). Code blocks,
  tables, and exact values inside `content` are preserved verbatim. If the body has no
  `## ` headings, emit a single chunk with `"section": ""` and the whole body (minus
  footer / See also) as `content`.

A single source may yield 0, 1, or many topics.

If the file is empty or contains nothing but noise (greetings, disclaimers, unresolved
chatter with no takeaway), mark it as **skip-no-content** and move on.

### 2b — Propose outputs

For each topic, compute:

- **Title**: concise, descriptive, in English.
- **Category**: one of the routes below, with a one-line rationale.
- **Type**: the route label (`decisions`, `numbers`, `observations`, `patterns`,
  `projects`, or `notes`).
- **Filename**: kebab-case, `.md`, derived from the title (e.g. `api-rate-limit-quota.md`).
- **Destination**: `<category-dir>/<filename>` (the markdown path).
- **JSON path**: the destination with the extension swapped to `.json`
  (e.g. `captures/numbers/api-rate-limit-quota.json`). The JSON uses the same basename as
  the `.md` so the pair travels together; the collision suffix is applied to the `.md`
  first and mirrored onto the `.json`.
- **Body**: the normalized markdown (see Normalization rules).
- **Structured data**: the JSON object built from the subagent output per the schema in
  Normalization rules → Structured companion.

Collision handling: if the destination `.md` path already exists, do not overwrite. Suffix
the filename with `-2`, `-3`, … until free. The `.json` companion takes the same suffixed
basename. If a near-identical file already exists, offer to skip instead of duplicating —
skipping skips both the `.md` and the `.json` atomically.

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
JSON   : <json companion path>
┄┄┄ Preview (first ~20 lines) ┄┄┄
<normalized body head>
┄┄┄ Summary ┄┄┄
<one-paragraph summary>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Confirming writes both the `.md` and the `.json` atomically — they share one prompt.

Choice menu:

```
1. Write as proposed
2. Edit            — change title, filename, tags, or body
3. Recategorize    — pick a different route
4. Skip topic
5. Skip rest of file
```

Default (pressing enter) = `1 Write`.

### 2d — Write

On `Write` / `Edit` / `Recategorize` (after corrections), write the destination `.md`
file with the normalized body, then write the sibling `.json` file with the structured
data (2-space indented, trailing newline).

Confirm with a single line: `wrote <md path> (+ json)`.

Write ordering: write the `.md` first. If the `.json` write fails after the `.md`
succeeded, leave the `.md` in place (it is still valid prose), warn the user that the
companion is missing, and **do not delete the source** (so the run can be retried).

After every topic from a source file has been handled (written or skipped), apply the
source-deletion rule (see below).

---

## Step 2.5 — Paper-specific processing

When a source file comes from `inbox/papers/`, the text-analyst subagent must
additionally extract three paper-specific artifacts:

**Abstract**: the paper's abstract verbatim. If the paper has no discernible
abstract section, return `null` and note it in the rationale.

**Conclusion**: the paper's conclusion or discussion section verbatim. If absent,
return `null`.

**Numbers / data**: all quantitative facts found in the paper — metrics,
benchmarks, sample sizes, p-values, effect sizes, percentages, measurements,
dates of experiments. Each item is an object:

```json
{
  "metric": "<what was measured>",
  "value": "<exact value>",
  "context": "<short description of significance>"
}
```

If no quantitative data is found, return an empty array `[]`.

### Paper body format

The normalized body for a paper follows this structure:

```markdown
# <paper title>

## Abstract
<extracted abstract text>

## Findings
<key findings and contributions, distilled into declarative prose>

## Numbers

| Metric | Value | Context |
|--------|-------|---------|
| ...    | ...   | ...     |

## Conclusion
<extracted conclusion text>

## See also
...

> Source: <source path> · processed <YYYY-MM-DD>
```

- If the abstract is absent, omit the `## Abstract` section entirely.
- If the conclusion is absent, omit the `## Conclusion` section entirely.
- If no numbers are found, omit the `## Numbers` section entirely.

### Number splitting

Each row in the numbers table may qualify as a standalone quantitative fact that
deserves its own entry in `captures/numbers/`. Propose each row that satisfies
all three fields (metric, value, context) as a separate topic output using the
same confirmation flow described in Step 2b–2d. The user can write, skip, or
merge these split-off numbers.

When a row is split into its own `captures/numbers/` entry:

- The title is derived from the metric (e.g. "GPT-4 accuracy on MMLU").
- The body is a concise one-paragraph note with the metric, value, and context.
- The JSON companion follows the standard schema (no paper-specific fields).
- A cross-reference back to the paper is added under `## See also`.

Rows that are too trivial (label-less numbers, vague statements without a
concrete metric) should NOT be proposed for splitting — only concrete,
context-rich quantitative facts.

### Categorization default

Papers from `inbox/papers/` default to `notes/papers/` for the body output.
Split numbers default to `captures/numbers/`. The standard precedence chain
applies (`decisions/ > projects/ > captures/* > notes/`), but a paper is
always filed under `notes/papers/` unless the user explicitly recategorizes.

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
    notes/papers/          : N
  JSON companions          : N   (paired with the files above)
  Topics skipped           : N
  Sources deleted          : N
  Sources kept (all-skipped): N
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If no files were written at all, say so, note that no `.json` companions were written
either, and remind the user the inbox is untouched.

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
| A foundational principle, law, mental model, or definition             | `captures/concepts/`      |
| Academic paper, preprint, or technical report (from `inbox/papers/`)    | `notes/papers/`           |
| Tied to a named project or initiative (and not a decision)              | `projects/<project>/`     |
| General reference, explanation, how-to (the default catch-all)          | `notes/`                  |

`captures/` subfolder definitions:

- **numbers/** — quantitative facts: metrics, quotas, limits, benchmarks, sizes.
- **observations/** — qualitative findings: behaviors, states, "we noticed that …".
- **patterns/** — reusable approaches: techniques, conventions, "how we handle …".
- **concepts/** — foundational principles, laws, mental models, definitions.

Precedence when a topic fits more than one row:

```
decisions/  >  projects/  >  captures/*  >  notes/
```

That is: a decision wins even if it mentions a project; a project-scoped non-decision
beats a generic capture; `notes/` is always the fallback. Papers from `inbox/papers/`
default to `notes/papers/` regardless of precedence (they are not decisions, projects,
or generic captures).

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

**Papers**: papers from `inbox/papers/` follow the format defined in Step 2.5
(`# Title`, `## Abstract`, `## Findings`, `## Numbers`, `## Conclusion`,
`## See also`). If the abstract or conclusion is not found by the subagent,
omit that section entirely — do not write placeholder text in the body.
The `## Numbers` section uses a markdown table with columns `| Metric | Value |
Context |`. If no numbers are found, omit the section.

Provenance footer: append a single line at the end of every written file:

```
> Source: <source path> · processed <YYYY-MM-DD>
```

This survives the source-file deletion and keeps the note traceable.

### Structured companion (JSON)

Every written `.md` is paired with a sibling `.json` of the same basename. The JSON is the
data a RAG indexer reads; it is model-agnostic (no embeddings here — the indexer chooses
the embedder). Schema (field order is fixed so re-runs produce stable diffs):

```json
{
  "id": "<destination path without extension, e.g. captures/numbers/foo>",
  "path": "<destination .md path, e.g. captures/numbers/foo.md>",
  "title": "<the # Title, verbatim>",
  "category": "<full destination dir, e.g. captures/numbers>",
  "type": "<decisions|numbers|observations|patterns|concepts|projects|notes>",
  "summary": "<one-paragraph retrieval-tuned abstract from the subagent>",
  "keywords": ["<3–10 lowercase terms>"],
  "entities": ["<proper nouns / identifiers, verbatim>"],
  "see_also": ["<relative .md paths from See also, no link text>"],
  "source": "<original inbox path, matches the provenance footer>",
  "processed_at": "<YYYY-MM-DD, matches the provenance footer>",
  "chunks": [
    {
      "section": "<H2 heading text, or empty string for a single-chunk body>",
      "content": "<section body verbatim, including the ## line>"
    }
  ],
  "abstract": "<extracted abstract verbatim, or null>",
  "conclusion": "<extracted conclusion verbatim, or null>",
  "numbers": [
    {
      "metric": "<what was measured>",
      "value": "<exact value>",
      "context": "<short description of significance>"
    }
  ]
}
```

Notes:

- `see_also` is an array of relative paths (relative to the `.md` location) with no link
  text. If the markdown has no `## See also` section, emit an empty array.
- `id` is the `path` with its extension removed. It is stable only as long as the path is
  unchanged; treat renames as a new id (the indexer can re-key on `path`).
- The `## See also` section and the provenance footer are **excluded** from `chunks` —
  they are metadata, not retrievable content.
- Chunk bodies preserve code blocks, tables, and exact values verbatim.
- **Paper-only fields**: `abstract`, `conclusion`, and `numbers` are present only when the
  source is from `inbox/papers/`. For all other sources, emit `null`, `null`, and `[]`
  respectively (or omit the keys — indexers treat missing and null the same). Split-off
  number entries in `captures/numbers/` do *not* carry these fields.

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
- **JSON write fails after `.md` write**: leave the `.md` in place, warn that the
  companion is missing, keep the source file (so the run can be retried), and continue.
- **`.md` exists but `.json` missing (or vice versa)** on a re-run: still apply the
  collision rule to the `.md`; if the user chooses Write, sync the missing half of the
  pair. If the user skips, leave the orphan half untouched and warn.
- **Re-processed source**: if the resulting `.md` path collides and is skipped, no `.json`
  is written either — the pair is atomic.
- **Paper with no abstract or conclusion**: omit the missing sections from the body and
  JSON. The subagent returns `null` for that field. The body and JSON are still valid.

---

## What this skill does NOT do

- Does not modify or move files already sitting in the categorized directories — only
  writes new files and deletes inbox sources.
- Does not push to git or commit; the user commits when they choose.
- Does not translate English content; translates non-English content to English.
- Does not auto-write without confirmation — every topic is shown first.
- Does not touch `.keep` files or dotfiles.
- Does not generate embeddings — the JSON stays model-agnostic. A separate indexer reads
  `**/*.json` and chooses the embedder.

---

## Example invocations

```
/process-inbox
/process-inbox chats
/process-inbox agents
/process-inbox articles
/process-inbox papers
/process-inbox 2026-07-02-standup.md
process inbox
triage inbox
process papers
```
