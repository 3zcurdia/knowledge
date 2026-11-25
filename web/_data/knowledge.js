import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dataDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dataDirectory, "../..");
const contentRoots = ["captures", "notes", "projects", "decisions"];

export function normalizeInputPath(inputPath = "") {
  return inputPath.replace(/^(?:\.{1,2}\/)+/, "").replaceAll("\\", "/");
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith(".") || entry.name.startsWith("_")) return [];
      return walk(absolutePath);
    }
    return [absolutePath];
  });
}

function firstParagraph(markdown) {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith("#") && !line.startsWith(">")) || "";
}

function titleFromMarkdown(markdown, fallback) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
}

function titleCase(value) {
  return value
    .split(/[-_/]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function readMetadata(markdownPath) {
  const metadataPath = markdownPath.replace(/\.md$/i, ".json");
  if (!fs.existsSync(metadataPath)) return {};

  try {
    return JSON.parse(fs.readFileSync(metadataPath, "utf8"));
  } catch (error) {
    console.warn(`[knowledge] Invalid JSON metadata: ${metadataPath}\n${error.message}`);
    return {};
  }
}

const files = contentRoots
  .filter((directory) => fs.existsSync(path.join(root, directory)))
  .flatMap((directory) => walk(path.join(root, directory)))
  .filter((absolutePath) => {
    const relativePath = path.relative(root, absolutePath).replaceAll("\\", "/");
    return relativePath.endsWith(".md") && path.basename(absolutePath) !== "INDEX.md";
  });

const entries = files
  .map((absolutePath) => {
    const relativePath = path.relative(root, absolutePath).replaceAll("\\", "/");
    const markdown = fs.readFileSync(absolutePath, "utf8");
    const metadata = readMetadata(absolutePath);
    const fallbackTitle = path.basename(relativePath, ".md");
    const segments = relativePath.split("/");
    const category = metadata.category || segments.slice(0, 2).join("/");
    const type = metadata.type || segments[0];
    const processedAt = metadata.processed_at || fs.statSync(absolutePath).mtime.toISOString().slice(0, 10);

    return {
      inputPath: relativePath,
      relativePath,
      url: `/${relativePath.replace(/\.md$/i, ".html")}`,
      title: metadata.title || titleFromMarkdown(markdown, fallbackTitle),
      summary: metadata.summary || firstParagraph(markdown),
      category,
      categorySlug: category.replaceAll("/", "-"),
      categoryLabel: titleCase(category),
      type,
      keywords: Array.isArray(metadata.keywords) ? metadata.keywords : [],
      entities: Array.isArray(metadata.entities) ? metadata.entities : [],
      source: metadata.source || "",
      processedAt,
      hasMetadata: Object.keys(metadata).length > 0,
    };
  })
  .sort((a, b) => b.processedAt.localeCompare(a.processedAt) || a.title.localeCompare(b.title));

const byPath = Object.fromEntries(entries.map((entry) => [entry.inputPath, entry]));

const categoryMap = new Map();
for (const entry of entries) {
  const category = categoryMap.get(entry.category) || {
    slug: entry.categorySlug,
    label: entry.categoryLabel,
    name: entry.category,
    count: 0,
    url: `/browse/${entry.categorySlug}.html`,
  };
  category.count += 1;
  categoryMap.set(entry.category, category);
}

const categories = [...categoryMap.values()].sort(
  (a, b) => b.count - a.count || a.label.localeCompare(b.label)
);

const types = [...new Set(entries.map((entry) => entry.type))].sort();

export default {
  root,
  entries,
  byPath,
  categories,
  types,
  total: entries.length,
};
