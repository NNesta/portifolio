// The live numbers as they were when the site was last built. The build
// fetches them, renders the page with them and embeds them in the HTML
// (scripts/prerender.js), so the first paint is already up to date and the
// browser hydrates with exactly the same numbers.

import type { CodewarsStats, LeetcodeStats } from "../types";

export interface Snapshot {
  codewars?: Partial<CodewarsStats>;
  leetcode?: LeetcodeStats;
}

let current: Snapshot = {};

export const getSnapshot = () => current;

export function setSnapshot(snapshot: Snapshot) {
  current = snapshot;
}

/** Reads the snapshot the build embedded in the page; empty in development. */
export function readEmbeddedSnapshot(): Snapshot {
  try {
    return JSON.parse(document.getElementById("snapshot")?.textContent ?? "{}") as Snapshot;
  } catch {
    return {};
  }
}
