# AST-Grep: Structural Code Find-and-Replace for Elixir

AST-grep finds and replaces code based on abstract syntax tree (AST) patterns rather than text regex, making it far more expressive than `sed` for source code transformations.

## Example: Converting `conn = get(conn, ...)` to Pipe Syntax

Rule using `precedes` for relational matching:
```yaml
id: conn-pipe-syntax-1
language: elixir
rule:
  pattern: conn = $METHOD(conn, $$$ALL_PARAMS)
  precedes:
    pattern: assert $RESPONSE_FUNCTION(conn, $STATUS)
fix:
  template: |-
    conn
    |> $METHOD($$$ALL_PARAMS)
    |> $RESPONSE_FUNCTION($STATUS)
  expandEnd:
    pattern: |
      assert $RESPONSE_FUNCTION(conn, $STATUS)
```

## Key Features

- **Relational rules:** `precedes`, `follows`, `inside`, `has` for multi-node patterns
- **Multi metavariables:** `$$$ALL_PARAMS` matches zero or more arguments
- **`expandEnd`:** extend fix to remove additional matched code
- **YAML block chomping (`|-`):** prevent trailing newlines in replacements
- **`constraints`:** filter by AST node type (e.g. `kind: identifier`)
- **Composite rules:** `any:` for matching multiple pattern alternatives

## Usage

```bash
# Apply all fixes
ast-grep scan --rule rules.yaml --update-all .

# Check only (CI)
ast-grep scan --rule rules.yaml
```

## Tips

- Use the online playground to debug rules with AST visualization
- Pattern matching ignores whitespace/newlines — focus on structure
- Start with specific patterns, then parameterize with metavariables

> Source: inbox/articles/Cleaning up code using ast-grep.md · processed 2026-07-02
