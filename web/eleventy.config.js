import { execFileSync } from "node:child_process";
import { HtmlBasePlugin } from "@11ty/eleventy";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import knowledge, { normalizeInputPath } from "./_data/knowledge.js";
import site from "./_data/site.js";
import computed from "./_data/eleventyComputed.js";

export const config = {
  markdownTemplateEngine: false,
  htmlTemplateEngine: "njk",
  pathPrefix: "/",
};

export default function (eleventyConfig) {
  eleventyConfig.setInputDirectory("..");
  eleventyConfig.setOutputDirectory("_site");
  eleventyConfig.setIncludesDirectory("web/_includes");

  eleventyConfig.setTemplateFormats(["md", "njk", "html"]);
  eleventyConfig.setQuietMode(true);

  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addGlobalData("layout", "wiki.njk");
  eleventyConfig.addGlobalData("site", site);
  eleventyConfig.addGlobalData("knowledge", knowledge);
  eleventyConfig.addGlobalData("eleventyComputed", computed.eleventyComputed);

  eleventyConfig.addNunjucksFilter("categoryUrl", (category) => {
    const slug = String(category).replaceAll("/", "-");
    return `/browse/${slug}.html`;
  });

  eleventyConfig.addNunjucksFilter("findCategory", (slug) => {
    return knowledge.categories.find((category) => category.slug === slug)?.label || "Category";
  });

  for (const pattern of [
    "web/_site/**",
    "web/README.md",
    "inbox/**",
    "scripts/**",
    ".git/**",
    ".github/**",
    ".opencode/**",
    "**/INDEX.md",
    "AGENTS.md",
    "README.md",
  ]) {
    eleventyConfig.ignores.add(pattern);
  }

  eleventyConfig.watchIgnores.add("web/_site/**");
  eleventyConfig.watchIgnores.add("web/node_modules/**");

  eleventyConfig.addPassthroughCopy({ assets: "assets" });
  eleventyConfig.addPassthroughCopy({ "assets/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ CNAME: "CNAME" });

  eleventyConfig.addPreprocessor("knowledge-markdown", "md", function (data, content) {
    const entry = knowledge.byPath[normalizeInputPath(this.inputPath)];
    if (!entry) return false;

    data.title = entry.title;
    return content.replace(/^#\s+.+(?:\r?\n)+/, "");
  });

  eleventyConfig.addTransform("knowledge-links", function (content) {
    if (!this.page.inputPath.endsWith(".md")) return content;

    return content.replace(/href="([^"]+)"/g, (match, href) => {
      if (
        href.startsWith("#") ||
        href.startsWith("/") ||
        href.startsWith("//") ||
        /^[a-z][a-z0-9+.-]*:/i.test(href)
      ) {
        return match;
      }

      const splitAt = href.search(/[?#]/);
      const pathname = splitAt === -1 ? href : href.slice(0, splitAt);
      const suffix = splitAt === -1 ? "" : href.slice(splitAt);

      return pathname.endsWith(".md")
        ? `href="${pathname.slice(0, -3)}.html${suffix}"`
        : match;
    });
  });

  eleventyConfig.addCollection("knowledge", (collection) =>
    collection.getAll().filter((item) => knowledge.byPath[normalizeInputPath(item.inputPath)])
  );

  const page = (virtualPath, layout, title, permalink, data = {}) => {
    eleventyConfig.addTemplate(virtualPath, "", {
      layout,
      title,
      permalink,
      excludeFromSearch: true,
      ...data,
    });
  };

  page("index.njk", "home.njk", "Knowledge", "/index.html");
  page("browse/index.njk", "browse.njk", "Browse knowledge", "/browse.html");
  page("search/index.njk", "search.njk", "Search knowledge", "/search.html");
  page("404.njk", "wiki.njk", "Page not found", "/404.html", {
    excludeFromSearch: true,
    notFound: true,
  });

  eleventyConfig.addTemplate("sitemap.xml.njk", '{% include "sitemap.njk" %}', {
    layout: false,
    permalink: "/sitemap.xml",
    eleventyExcludeFromCollections: true,
  });

  for (const category of knowledge.categories) {
    page(
      `browse/${category.slug}.njk`,
      "browse.njk",
      category.label,
      `/browse/${category.slug}.html`,
      { activeCategory: category.slug }
    );
  }

  eleventyConfig.on("eleventy.after", () => {
    if (process.env.SKIP_PAGEFIND === "1") return;

    const npx = process.platform === "win32" ? "npx.cmd" : "npx";
    execFileSync(npx, ["pagefind", "--site", "_site"], { stdio: "inherit" });
  });
}
