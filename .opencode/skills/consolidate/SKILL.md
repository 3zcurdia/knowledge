---
name: consolidate
description: |
  Scan the categorized knowledge base for duplicates, overlapping topics, and missing
  cross-references. Interactively proposes merges, consolidations, and link additions.
  Use ONLY when the working directory is the knowledge base root containing AGENTS.md.
  Fire when the user says "consolidate", "consolidate kb", "review kb",
  "find duplicates", "merge notes", or runs "/consolidate".
user_invocable: true
---

# /consolidate

Scan all categorized directories for duplicates, overlapping content, and missing
cross-references. Present each finding interactively with options to merge, link, or skip.

## Invocation

```
/consolidate                    # scan all categorized directories
consolidate kb                  # natural-language trigger
review kb                       # natural-language trigger
find duplicates                 # natural-language trigger
merge notes                     # natural-language trigger
```

---

## Step 0 — Scope guard

Verify the working directory is the knowledge base root. It must contain `AGENTS.md`.
If missing, stop and tell the user this skill only runs inside the knowledge repo.

---

## Step 1 — Collect KB files

Build the scan list:

1. Search these directories for `.md` files:
   - `captures/**` (including `numbers/`, `observations/`, `patterns/`)
   - `decisions/**`
   - `notes/**`
   - `projects/**` (including subdirectories)
2. Exclude `.keep`, dotfiles, and the `inbox/` directory entirely.
3. Sort alphabetically by path.

If fewer than 2 files are found, print "KB has fewer than 2 files — nothing to consolidate." and stop.

---

## Step 2 — Analyze for issues

For each file, extract:
- Title (from the `# Title` heading)
- Key topics and concepts mentioned
- Existing `## See also` cross-references

Then detect three types of issues:

### 2a — Duplicates

Files with:
- Near-identical titles (e.g., "API Rate Limits" vs "API Rate Limit Quotas")
- Heavily overlapping content (same core information, different wording)

### 2b — Overlaps

Files covering related sub-topics that would benefit from consolidation:
- One file is a subset of another
- Multiple files cover different aspects of the same topic
- Files that should logically be sections of a single document

### 2c — Missing cross-references

Files that:
- Reference the same concepts, tools, or projects but don't link to each other
- Cover related topics (e.g., a decision and the pattern it established)
- Are mentioned in each other's content but lack a `## See also` link

---

## Step 3 — Interactive review

For each finding, display a block and wait for a choice:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Finding [1/N]: <issue type>

  File A: <path A>
    Title: <title A>
    Key topics: <list>

  File B: <path B>
    Title: <title B>
    Key topics: <list>

  Reason: <why these files are flagged>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Choice menu:

```
1. Merge into A      — consolidate content into File A, delete File B
2. Merge into B      — consolidate content into File B, delete File A
3. Add cross-references — add ## See also links to both files
4. Keep as-is        — no changes, move to next finding
5. Skip rest         — stop processing findings
```

Default (pressing enter) = `4 Keep as-is`.

### Merge behavior

When merging:
- Combine content from both files into the surviving file
- Preserve the surviving file's title and structure
- Append unique content from the deleted file as new sections
- Merge `## See also` sections (deduplicate links)
- Update the provenance footer to note the merge: `> Merged: <deleted path> · <YYYY-MM-DD>`
- Delete the non-surviving file

### Cross-reference behavior

When adding cross-references:
- Add or update the `## See also` section in both files
- Place it before the provenance footer (if present)
- Use relative paths: `[<title>](<relative-path>)`
- Do not create duplicate links if they already exist

---

## Step 4 — Summary

After processing all findings (or stopping early), print a summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Done. KB consolidation complete.

  Findings reviewed        : N
  Merges performed         : N
  Cross-references added   : N
  Kept as-is               : N
  Skipped                  : N
  Files deleted            : N
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Edge cases

- **Single file in a directory**: skip that directory (nothing to compare)
- **Very large files**: analyze by title and key sections, not full content
- **Files without `# Title` heading**: flag as malformed, skip
- **Circular references**: detect and skip (don't add A→B if B→A already exists)
- **Empty KB**: report and stop; do not error

---

## What this skill does NOT do

- Does not modify files in `inbox/` — only categorized directories
- Does not push to git or commit; the user commits when they choose
- Does not auto-merge without confirmation — every action is shown first
- Does not touch `.keep` files or dotfiles
- Does not re-categorize files (use `/process-inbox` for that)

---

## Example invocations

```
/consolidate
consolidate kb
review kb
find duplicates
merge notes
```
