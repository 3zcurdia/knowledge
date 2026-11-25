import knowledge, { normalizeInputPath } from "./knowledge.js";

export default {
  eleventyComputed: {
    entry: (data) => knowledge.byPath[normalizeInputPath(data.page.inputPath)] || null,
    title: (data) => {
      const entry = knowledge.byPath[normalizeInputPath(data.page.inputPath)];
      return entry?.title || data.title;
    },
    summary: (data) => {
      const entry = knowledge.byPath[normalizeInputPath(data.page.inputPath)];
      return entry?.summary || data.summary || "";
    },
    permalink: (data) => {
      const inputPath = normalizeInputPath(data.page.inputPath);
      return knowledge.byPath[inputPath]
        ? `/${inputPath.replace(/\.md$/i, ".html")}`
        : data.permalink;
    },
  },
};
