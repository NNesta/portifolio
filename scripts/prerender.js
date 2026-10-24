// Last build step. Fetches the latest Codewars and LeetCode numbers, renders
// the React app to HTML with them and writes it into dist/index.html, so
// visitors (and search engines) get the full, current page in the first
// response, even on a slow connection. React then hydrates it.

import { readFile, rm, writeFile } from "node:fs/promises";

const dist = new URL("../dist/", import.meta.url);
const serverBuild = new URL("../dist-ssr/", import.meta.url);

const { render, loadSnapshot } = await import(new URL("entry-server.js", serverBuild).href);
const page = new URL("index.html", dist);
const html = await readFile(page, "utf8");
const root = '<div id="root"></div>';
if (!html.includes(root)) throw new Error(`prerender: ${root} not found in dist/index.html`);

const snapshot = await loadSnapshot();
// The browser reads the same numbers back, so hydration matches. "<" is
// escaped so the JSON can never close the script tag early.
const data = JSON.stringify(snapshot).replaceAll("<", String.raw`<`);
const body = `<div id="root">${render(snapshot)}</div>\n    <script id="snapshot" type="application/json">${data}</script>`;

// A function replacement, so "$" in the content is never read as a pattern.
await writeFile(page, html.replace(root, () => body));
await rm(serverBuild, { recursive: true, force: true });

const { codewars: cw, leetcode: lc } = snapshot;
console.log("prerender: dist/index.html now contains the rendered page");
console.log("prerender: Codewars", cw ? `${cw.rank}, ${cw.completed} kata` : "unavailable, using content.ts");
console.log("prerender: LeetCode", lc ? `${lc.solved} solved` : "unavailable");
