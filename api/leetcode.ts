// Vercel Function: GET /api/leetcode returns the LeetCode numbers of the
// profile set in src/content.ts. Browsers can't read LeetCode directly, so
// the page asks this function instead. Vercel's CDN keeps each answer for
// five minutes, so LeetCode sees at most one request per five minutes.
// It serves only that one profile, so it can't be used as an open proxy.

import { site } from "../src/content.js";
import { fetchLeetcode } from "../src/lib/leetcode.js";

export async function GET(): Promise<Response> {
  const username = site.practice.leetcode?.username;
  const stats = username ? await fetchLeetcode(username, AbortSignal.timeout(8000)) : null;
  if (!stats) {
    return Response.json(
      { error: "LeetCode numbers are unavailable right now." },
      { status: 502, headers: { "Cache-Control": "public, s-maxage=60" } },
    );
  }
  return Response.json(stats, {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400" },
  });
}
