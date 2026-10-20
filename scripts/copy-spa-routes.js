// Runs after `vite build` to make every page's URL work when opened directly.
//
// The site is a "single-page app": there's one real HTML file (index.html),
// and React Router picks which page to show based on the URL. Clicking links
// inside the site works on its own, but when someone opens
// ashutoshikade.github.io/projects straight from LinkedIn, GitHub Pages
// looks for a file at that path. So we put a copy of index.html there.
//
// 404.html is what GitHub Pages serves for any URL with no file, so old
// links (like /btc.html from the first version of the site) still load the
// app, which then redirects them or shows the "Page not found" page.

import { copyFile, mkdir } from "node:fs/promises";

// Keep in sync with the routes in src/App.jsx.
const ROUTES = ["projects", "blog", "blog/exploring-binance-api", "contact"];

const dist = new URL("../dist/", import.meta.url);
const indexHtml = new URL("index.html", dist);

await copyFile(indexHtml, new URL("404.html", dist));
for (const route of ROUTES) {
  const folder = new URL(`${route}/`, dist);
  await mkdir(folder, { recursive: true });
  await copyFile(indexHtml, new URL("index.html", folder));
}
console.log(`Copied index.html to 404.html and ${ROUTES.length} route folders`);
