// LeetCode has no public API that browsers may call (it sends no CORS
// headers), so its numbers are fetched on a server: by api/leetcode.ts for
// visitors, and by the build for the prerendered page. Both read the same
// GraphQL endpoint that leetcode.com uses for its own profile pages.

// ".js" because Vercel also compiles this file for api/leetcode.ts, as Node ESM.
import type { LeetcodeStats } from "../types.js";

const QUERY = `query profile($username: String!) {
  matchedUser(username: $username) {
    profile { ranking }
    submitStatsGlobal { acSubmissionNum { difficulty count } }
    languageProblemCount { languageName problemsSolved }
  }
  allQuestionsCount { difficulty count }
  userContestRanking(username: $username) { rating topPercentage attendedContestsCount }
}`;

interface Count {
  difficulty: string;
  count: number;
}

interface Reply {
  data?: {
    matchedUser: null | {
      profile: { ranking: number | null };
      submitStatsGlobal: { acSubmissionNum: Count[] };
      languageProblemCount: { languageName: string; problemsSolved: number }[];
    };
    allQuestionsCount: Count[];
    userContestRanking: null | { rating: number; topPercentage: number | null; attendedContestsCount: number };
  };
}

// Profiles without a ranking get a placeholder of about 5,000,000.
const UNRANKED = 5_000_000;
const LANGUAGE_NAMES: Record<string, string> = { Python3: "Python", MySQL: "SQL", MS_SQL_SERVER: "SQL Server" };

const count = (list: Count[], difficulty: string) => list.find((c) => c.difficulty === difficulty)?.count ?? 0;

/** The public numbers of a LeetCode profile, or null if they can't be read. */
export async function fetchLeetcode(username: string, signal?: AbortSignal): Promise<LeetcodeStats | null> {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json", Referer: `https://leetcode.com/u/${username}/` },
      body: JSON.stringify({ query: QUERY, variables: { username } }),
    });
    if (!res.ok) return null;
    const { data } = (await res.json()) as Reply;
    const user = data?.matchedUser;
    if (!data || !user) return null;

    const solved = user.submitStatsGlobal.acSubmissionNum;
    const total = data.allQuestionsCount;
    const contest = data.userContestRanking?.attendedContestsCount ? data.userContestRanking : null;
    const { ranking } = user.profile;
    return {
      solved: count(solved, "All"),
      easy: count(solved, "Easy"),
      medium: count(solved, "Medium"),
      hard: count(solved, "Hard"),
      totalEasy: count(total, "Easy"),
      totalMedium: count(total, "Medium"),
      totalHard: count(total, "Hard"),
      ranking: ranking && ranking < UNRANKED ? ranking : null,
      contestRating: contest ? Math.round(contest.rating) : null,
      contestTop: contest?.topPercentage ?? null,
      languages: [...user.languageProblemCount]
        .sort((a, b) => b.problemsSolved - a.problemsSolved)
        .slice(0, 3)
        .map((l) => LANGUAGE_NAMES[l.languageName] ?? l.languageName),
    };
  } catch {
    return null;
  }
}

/** Accepts the answer from api/leetcode only if it has the expected shape. */
export const pickLeetcode = (json: LeetcodeStats) =>
  typeof json?.solved === "number" && Array.isArray(json.languages) ? json : null;
