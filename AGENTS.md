# AGENTS.md

This is a markdown-only knowledge base. All content files use `.md` extension.

## Directory structure

- `captures/` — external content, clippings, references
  - `numbers/` — quantitative facts: metrics, quotas, limits, benchmarks
  - `observations/` — qualitative findings: behaviors, states, "we noticed that…"
  - `patterns/` — reusable approaches: techniques, conventions, "how we handle…"
  - `concepts/` — foundational principles, laws, mental models, definitions
- `decisions/` — decision records (ADRs, trade-offs, rationale)
- `inbox/` — unprocessed items
  - `agents/` — agent-generated content pending review
  - `articles/` — article clippings and external reads to process
  - `chats/` — conversation extracts to process
  - `papers/` — academic papers and research articles to process
  - `video/` — video and audio files pending transcription (whisper-cpp)
- `notes/` — general notes and references
  - `papers/` — processed academic papers (abstract, findings, conclusion, numbers)
- `projects/` — project-specific knowledge
  - `prompts/` — reusable prompt templates and examples

## Conventions

- Use kebab-case for filenames: `topic-name.md`
- One topic per file
- Start each file with a `# Title` heading

## Cross-references

Add a `## See also` section near the bottom of a file (before the source footer) with relative markdown links to related entries:

```markdown
## See also

- [Related topic](../captures/patterns/foo.md)
- [Another entry](../decisions/bar.md)
```
