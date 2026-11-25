const root = document.documentElement;
const themeButton = document.querySelector("[data-theme-toggle]");
const menuButton = document.querySelector("[data-menu-toggle]");
const sidebar = document.querySelector("#sidebar");

function currentTheme() {
  return root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}

function updateThemeLabel() {
  if (!themeButton) return;
  const next = currentTheme() === "dark" ? "light" : "dark";
  themeButton.setAttribute("aria-label", `Switch to ${next} theme`);
}

themeButton?.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try {
    localStorage.setItem("knowledge-theme", next);
  } catch (error) {}
  updateThemeLabel();
});

matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (!root.dataset.theme) updateThemeLabel();
});
updateThemeLabel();

function closeMenu() {
  document.body.classList.remove("sidebar-open");
  menuButton?.setAttribute("aria-expanded", "false");
}

menuButton?.addEventListener("click", () => {
  const open = document.body.classList.toggle("sidebar-open");
  menuButton.setAttribute("aria-expanded", String(open));
});

sidebar?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

const prose = document.querySelector(".article .prose");
const toc = document.querySelector("[data-toc]");
if (prose && toc) {
  const used = new Set();
  for (const heading of prose.querySelectorAll("h2, h3")) {
    const base = slugify(heading.textContent) || "section";
    let id = base;
    let suffix = 2;
    while (used.has(id)) id = `${base}-${suffix++}`;
    used.add(id);
    heading.id = id;

    const anchor = document.createElement("a");
    anchor.className = "heading-anchor";
    anchor.href = `#${id}`;
    anchor.textContent = "#";
    anchor.setAttribute("aria-label", `Link to ${heading.textContent}`);
    heading.appendChild(anchor);

    const link = document.createElement("a");
    link.href = `#${id}`;
    link.textContent = heading.textContent.replace(/#$/, "").trim();
    link.className = heading.tagName === "H3" ? "level-3" : "level-2";
    toc.appendChild(link);
  }
}

const modal = document.querySelector("pagefind-modal");
document.querySelectorAll("[data-open-search]").forEach((button) => {
  button.addEventListener("click", () => modal?.open());
});

if (location.pathname.endsWith("/search.html")) {
  const query = new URLSearchParams(location.search).get("q");
  if (query) {
    void (async () => {
      for (let attempt = 0; attempt < 50 && !window.PagefindComponents; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      if (!window.PagefindComponents) return;
      const manager = window.PagefindComponents.getInstanceManager();
      manager.getInstance("default").triggerSearch(query);
    })();
  }
}
