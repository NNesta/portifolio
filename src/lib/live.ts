// Live Codewars and GitHub numbers, fetched in the visitor's browser.
// Answers are cached for an hour (GitHub allows 60 requests an hour per
// visitor). Any failure returns null and the page keeps the numbers
// written in content.ts.

import type { CodewarsStats, KyuColor, Repo } from "../types";

const HOUR = 60 * 60 * 1000;

/** Fetches `url` as `Json` and keeps what `pick` returns. */
export async function getJSON<Json, T>(key: string, url: string, pick: (json: Json) => T | null, signal: AbortSignal) {
  try {
    const cached = JSON.parse(localStorage.getItem(key) ?? "null") as { t: number; d: T } | null;
    if (cached && Date.now() - cached.t < HOUR) return cached.d;
  } catch {
    // Storage blocked or a bad entry: fetch fresh.
  }
  try {
    const res = await fetch(url, { signal, headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const data = pick((await res.json()) as Json);
    if (data) {
      try {
        localStorage.setItem(key, JSON.stringify({ t: Date.now(), d: data }));
      } catch {
        // Not cached this time; the next visit fetches again.
      }
    }
    return data;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------ Codewars */
const LANGUAGE_NAMES: Record<string, string> = {
  javascript: "JavaScript", typescript: "TypeScript", python: "Python", java: "Java", sql: "SQL",
  csharp: "C#", cpp: "C++", c: "C", ruby: "Ruby", go: "Go", php: "PHP", rust: "Rust", kotlin: "Kotlin",
  swift: "Swift", shell: "Shell", coffeescript: "CoffeeScript", dart: "Dart", scala: "Scala",
  haskell: "Haskell", elixir: "Elixir",
};
const languageName = (key: string) => LANGUAGE_NAMES[key] ?? key.charAt(0).toUpperCase() + key.slice(1);

interface CodewarsUser {
  honor?: number;
  leaderboardPosition?: number | null;
  codeChallenges?: { totalCompleted?: number };
  ranks?: {
    overall?: { name?: string; color?: string };
    languages?: Record<string, { score?: number }>;
  };
}

export const codewarsUrl = (username: string) =>
  `https://www.codewars.com/api/v1/users/${encodeURIComponent(username)}`;

export function pickCodewars(user: CodewarsUser): Partial<CodewarsStats> | null {
  const overall = user.ranks?.overall;
  if (!overall?.name) return null;
  const languages = Object.entries(user.ranks?.languages ?? {})
    .sort(([, a], [, b]) => (b.score ?? 0) - (a.score ?? 0))
    .map(([key]) => languageName(key))
    .slice(0, 3);
  return {
    rank: overall.name,
    rankColor: overall.color as KyuColor | undefined,
    honor: user.honor,
    leaderboard: user.leaderboardPosition ?? undefined,
    completed: user.codeChallenges?.totalCompleted,
    languages: languages.length ? languages : undefined,
  };
}

/* -------------------------------------------------------------- GitHub */
interface GithubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

export const githubUserUrl = (username: string) => `https://api.github.com/users/${encodeURIComponent(username)}`;
export const githubReposUrl = (username: string) => `${githubUserUrl(username)}/repos?sort=pushed&per_page=30`;

export const pickRepoCount = (user: { public_repos?: number }) =>
  typeof user.public_repos === "number" ? user.public_repos : null;

export function pickRepos(repos: GithubRepo[]): Repo[] | null {
  if (!Array.isArray(repos)) return null;
  return repos
    .filter((r) => !r.fork && !r.archived)
    .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
    .slice(0, 12)
    .map((r) => ({
      name: r.name,
      description: r.description ?? "",
      language: r.language ?? "",
      stars: r.stargazers_count,
      url: r.html_url,
      pushed: r.pushed_at,
    }));
}
