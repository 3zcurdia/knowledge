# Knowledge website

A small Eleventy site that reads the knowledge base in place. The source
Markdown and sibling RAG JSON files are never modified or copied into the
website source tree.

## Development

```sh
cd web
npm install
npm run dev
```

Open http://localhost:8080/. Eleventy rebuilds the site and Pagefind
reindexes it after each build.

## Production build

```sh
cd web
npm run build
```

The generated site is written to `web/_site/` and includes the Pagefind search
bundle. GitHub Actions publishes that directory to GitHub Pages at:

https://kb.ezcurdia.dev/

## Content rules

The build includes Markdown under `captures/`, `notes/`, `projects/`, and
`decisions/`. It excludes `inbox/`, `INDEX.md` files, repository documentation,
and the website scaffolding itself. Paired JSON files provide titles, summaries,
categories, keywords, dates, and source metadata when available.
