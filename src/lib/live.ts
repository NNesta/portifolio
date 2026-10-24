// Live Codewars, LeetCode and GitHub numbers, loaded in the visitor's
// browser and shared by every component that shows them.
//
// - A returning visitor sees the last numbers straight away (localStorage),
//   then fresh ones as soon as they arrive.
// - Numbers refresh once they are older than their source's freshness
//   limit: when the page opens, when the tab comes back into view, and on a
//   timer while the page stays open. A change on Codewars or LeetCode shows
//   up within minutes, without a rebuild.
// - Any failure keeps whatever is already on screen.

import type { CodewarsStats, KyuColor, Repo } from "../types";

const MINUTE = 60_000;

/** How old numbers may get before they are fetched again. */
export const FRESH = {
  codewars: 5 * MINUTE,
  leetcode: 5 * MINUTE,
  github: 60 * MINUTE, // GitHub allows 60 requests an hour per visitor
};

interface Entry {
  t: number; // when it was fetched
  d: unknown; // the picked data
}

const memory = new Map<string, Entry>();
const listeners = new Map<string, Set<() => void>>();
const loading = new Set<string>();

export async function fetchJSON(url: string, signal?: AbortSignal): Promise<unknown> {
  const res = await fetch(url, { signal, headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} from ${url}`);
  return res.json();
}

/** The latest data for `key`, or null. Stable between changes, as React needs. */
export function peek<T>(key: string): T | null {
  return (memory.get(key)?.d as T | undefined) ?? null;
}

/** Fetches `url` unless the data for `key` is fresh or already loading. */
export async function refresh<Json, T>(key: string, url: string, pick: (json: Json) => T | null, maxAge: number) {
  const entry = memory.get(key);
  if (loading.has(key) || (entry && Date.now() - entry.t < maxAge)) return;
  loading.add(key);
  try {
    const data = pick((await fetchJSON(url, AbortSignal.timeout(8000))) as Json);
    if (!data) return;
    const fresh = { t: Date.now(), d: data };
    memory.set(key, fresh);
    try {
      localStorage.setItem(key, JSON.stringify(fresh));
    } catch {
      // Storage blocked: the numbers still show for this visit.
    }
    listeners.get(key)?.forEach((notify) => notify());
  } catch {
    // Offline, rate-limited or slow: keep what is shown.
  } finally {
    loading.delete(key);
  }
}

/** Subscribes to `key`: loads the stored copy, then keeps it fresh while the page is open. */
export function watch(key: string, onChange: () => void, load: () => void, maxAge: number) {
  if (!memory.has(key)) {
    try {
      const stored = JSON.parse(localStorage.getItem(key) ?? "null") as Entry | null;
      if (stored && typeof stored.t === "number") memory.set(key, stored);
    } catch {
      // Nothing usable stored.
    }
  }
  const subscribers = listeners.get(key) ?? new Set<() => void>();
  listeners.set(key, subscribers);
  subscribers.add(onChange);

  const loadIfVisible = () => {
    if (document.visibilityState === "visible") load();
  };
  load();
  document.addEventListener("visibilitychange", loadIfVisible);
  const timer = setInterval(loadIfVisible, maxAge);
  return () => {
    subscribers.delete(onChange);
    document.removeEventListener("visibilitychange", loadIfVisible);
    clearInterval(timer);
  };
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
