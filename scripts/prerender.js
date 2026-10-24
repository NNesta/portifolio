// Last build step. Renders the React app to HTML and writes it into
// dist/index.html, so visitors (and search engines) get the full page in
// the first response, even on a slow connection. React then hydrates it.

import { readFile, rm, writeFile } from "node:fs/promises";

const dist = new URL("../dist/", import.meta.url);
const serverBuild = new URL("../dist-ssr/", import.meta.url);

const { render } = await import(new URL("entry-server.js", serverBuild).href);
const page = new URL("index.html", dist);
const html = await readFile(page, "utf8");
const root = '<div id="root"></div>';
if (!html.includes(root)) throw new Error(`prerender: ${root} not found in dist/index.html`);

// A function replacement, so "$" in the content is never read as a pattern.
await writeFile(page, html.replace(root, () => `<div id="root">${render()}</div>`));
await rm(serverBuild, { recursive: true, force: true });
console.log("prerender: dist/index.html now contains the rendered page");
