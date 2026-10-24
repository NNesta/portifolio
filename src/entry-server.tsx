import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { site } from "./content";
import { fetchLeetcode } from "./lib/leetcode";
import { codewarsUrl, fetchJSON, pickCodewars } from "./lib/live";
import { setSnapshot, type Snapshot } from "./lib/snapshot";

/** Fetches the latest Codewars and LeetCode numbers at build time. A failure leaves that source out. */
export async function loadSnapshot(): Promise<Snapshot> {
  const { codewars, leetcode } = site.practice;
  if (!site.settings.liveData) return {};
  const [cw, lc] = await Promise.all([
    codewars
      ? fetchJSON(codewarsUrl(codewars.username), AbortSignal.timeout(8000)).then(
          (json) => pickCodewars(json as Parameters<typeof pickCodewars>[0]),
          () => null,
        )
      : null,
    leetcode ? fetchLeetcode(leetcode.username, AbortSignal.timeout(8000)) : null,
  ]);
  return { ...(cw && { codewars: cw }), ...(lc && { leetcode: lc }) };
}

/** Renders the whole page to HTML at build time (see scripts/prerender.js). */
export function render(snapshot: Snapshot) {
  setSnapshot(snapshot);
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
