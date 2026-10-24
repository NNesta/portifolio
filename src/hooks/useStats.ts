import { site } from "../content";
import { pickLeetcode } from "../lib/leetcode";
import { FRESH, codewarsUrl, pickCodewars } from "../lib/live";
import { getSnapshot } from "../lib/snapshot";
import type { CodewarsStats, LeetcodeStats } from "../types";
import { useLive } from "./useLive";

const { liveData } = site.settings;
const { codewars, leetcode } = site.practice;

/** Served by api/leetcode.ts (a Vercel Function); relative, like every asset path. */
const LEETCODE_API = "api/leetcode";

/** Codewars numbers: live, else from the last build, else from content.ts. */
export function useCodewars(): CodewarsStats | null {
  const live = useLive(
    `cw:${codewars?.username}`,
    liveData && codewars ? codewarsUrl(codewars.username) : null,
    pickCodewars,
    FRESH.codewars,
  );
  if (!codewars) return null;
  const built = liveData ? getSnapshot().codewars : undefined;
  const latest = <K extends keyof CodewarsStats>(field: K) => live?.[field] ?? built?.[field] ?? codewars[field];
  return {
    rank: latest("rank"),
    rankColor: latest("rankColor"),
    completed: latest("completed"),
    honor: latest("honor"),
    leaderboard: latest("leaderboard"),
    languages: latest("languages"),
  };
}

/** LeetCode numbers: live, else from the last build. */
export function useLeetcode(): LeetcodeStats | null {
  const live = useLive(`lc:${leetcode?.username}`, liveData && leetcode ? LEETCODE_API : null, pickLeetcode, FRESH.leetcode);
  if (!leetcode || !liveData) return null;
  return live ?? getSnapshot().leetcode ?? null;
}
