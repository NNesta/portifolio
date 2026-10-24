import { site } from "../content";
import { useLive } from "../hooks/useLive";
import { useCodewars, useLeetcode } from "../hooks/useStats";
import { FRESH, githubReposUrl, githubUserUrl, pickRepoCount, pickRepos } from "../lib/live";
import { andList, cx, formatNumber } from "../lib/utils";
import type { CodewarsStats, GithubProfile, KyuColor, LeetcodeStats, Repo } from "../types";
import { CountUp } from "./CountUp";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";
import { Section, SectionHead, TextLink } from "./ui";

const panel = "flex min-w-0 flex-col gap-5 rounded-card border border-line bg-surface p-[clamp(22px,3.5vw,36px)]";
const panelHead = "flex flex-wrap items-center justify-between gap-x-4 gap-y-2";
const KYU: Partial<Record<KyuColor, string>> = {
  white: "var(--kyu-white)",
  yellow: "var(--kyu-yellow)",
  blue: "var(--kyu-blue)",
  purple: "var(--kyu-purple)",
};

export function Practice() {
  const { github } = site.practice;
  const codewars = useCodewars();
  const leetcode = useLeetcode();
  // LeetCode shows up by itself once there is something to show.
  const showLeetcode = leetcode && leetcode.solved > 0;
  if (!codewars && !showLeetcode && !github) return null;
  return (
    <Section id="practice">
      <SectionHead id="practice" />
      <div className="grid gap-[clamp(16px,3vw,28px)] md:grid-cols-2">
        {codewars && <CodewarsPanel stats={codewars} />}
        {showLeetcode && <LeetcodePanel stats={leetcode} />}
        {github && <GithubPanel profile={github} wide={Boolean(showLeetcode)} />}
      </div>
    </Section>
  );
}

interface Stat {
  label: string;
  value: number;
  prefix?: string;
}

/** Big numbers that count up, and ease to new values as they change. */
function Numbers({ items }: { items: Stat[] }) {
  const shown = items.filter((s) => s.value > 0);
  if (!shown.length) return null;
  return (
    <dl className="grid grid-cols-[repeat(auto-fit,minmax(6rem,1fr))] gap-3">
      {shown.map((s) => (
        <div key={s.label} className="grid min-w-0 gap-0.5">
          <dt className="text-sm text-muted">{s.label}</dt>
          <dd className="type-title text-[clamp(1.5rem,2.6vw,1.9rem)] leading-[1.1] tabular-nums">
            <CountUp value={s.value} prefix={s.prefix} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

function CodewarsPanel({ stats }: { stats: CodewarsStats }) {
  const memberSince = site.practice.codewars?.memberSince;
  const languages = andList(stats.languages);
  const since = memberSince && `On Codewars since ${memberSince}`;
  const training = languages && `training in ${languages}`;
  let note = [since, training].filter(Boolean).join(", ");
  if (note) note = `${note.charAt(0).toUpperCase()}${note.slice(1)}.`;

  return (
    <Reveal as="article" className={panel}>
      <div className={panelHead}>
        <h3 className="type-title text-3xl">Codewars</h3>
        {stats.rank && (
          <span
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-current py-1 pr-3 pl-1.5 text-md font-bold transition-colors duration-500 before:size-4.5 before:rounded-full before:bg-current"
            style={{ color: KYU[stats.rankColor] ?? KYU.blue }}
          >
            {stats.rank}
          </span>
        )}
      </div>
      <Numbers
        items={[
          { label: "Kata solved", value: stats.completed },
          { label: "Honor", value: stats.honor },
          { label: "Leaderboard", value: stats.leaderboard, prefix: "#" },
        ]}
      />
      {note && <p className="text-md text-muted">{note}</p>}
      {site.links.codewars && (
        <p className="mt-auto pt-1">
          <TextLink href={site.links.codewars}>See my Codewars profile</TextLink>
        </p>
      )}
    </Reveal>
  );
}

const DIFFICULTIES = [
  { label: "Easy", solved: "easy", total: "totalEasy", fill: "bg-leet-easy" },
  { label: "Medium", solved: "medium", total: "totalMedium", fill: "bg-leet-medium" },
  { label: "Hard", solved: "hard", total: "totalHard", fill: "bg-leet-hard" },
] as const;

function LeetcodePanel({ stats }: { stats: LeetcodeStats }) {
  const languages = andList(stats.languages);
  return (
    <Reveal as="article" delay={90} className={panel}>
      <div className={panelHead}>
        <h3 className="type-title text-3xl">LeetCode</h3>
        {stats.contestTop != null && (
          <span className="rounded-full border-[1.5px] border-current px-3 py-1 text-md font-bold text-accent">
            Top {stats.contestTop.toLocaleString("en-US", { maximumFractionDigits: 1 })}%
          </span>
        )}
      </div>
      <Numbers
        items={[
          { label: "Solved", value: stats.solved },
          { label: "Ranking", value: stats.ranking ?? 0, prefix: "#" },
          { label: "Contest rating", value: stats.contestRating ?? 0 },
        ]}
      />
      {/* Solved out of all problems, per difficulty. The bars grow in with the panel. */}
      <dl className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-3 gap-y-2.5 text-sm">
        {DIFFICULTIES.map((d) => {
          const solved = stats[d.solved], total = stats[d.total];
          const share = total ? Math.max(solved / total, solved ? 0.02 : 0) : 0;
          return (
            <div key={d.label} className="col-span-3 grid grid-cols-subgrid items-center">
              <dt className="text-muted">{d.label}</dt>
              <dd aria-hidden="true" className="h-1.5 overflow-hidden rounded-full bg-line">
                <span
                  className={cx("block h-full w-(--share) rounded-full transition-[width] delay-200 duration-1000 ease-(--ease) in-data-[reveal=hidden]:w-0", d.fill)}
                  style={{ "--share": `${(share * 100).toFixed(2)}%` }}
                />
              </dd>
              <dd className="tabular-nums">
                <span className="font-semibold">{formatNumber(solved)}</span>
                <span className="text-muted"> / {formatNumber(total)}</span>
              </dd>
            </div>
          );
        })}
      </dl>
      {languages && <p className="text-md text-muted">Solving in {languages}.</p>}
      {site.links.leetcode && (
        <p className="mt-auto pt-1">
          <TextLink href={site.links.leetcode}>See my LeetCode profile</TextLink>
        </p>
      )}
    </Reveal>
  );
}

function GithubPanel({ profile, wide }: { profile: GithubProfile; wide: boolean }) {
  const { username } = profile;
  const live = site.settings.liveData;
  const count = useLive(`gh:user:${username}`, live ? githubUserUrl(username) : null, pickRepoCount, FRESH.github);
  const latest = useLive(`gh:repos:${username}`, live && profile.showLatest ? githubReposUrl(username) : null, pickRepos, FRESH.github);

  const hidden = new Set(profile.hideRepos.map((name) => name.toLowerCase()));
  const recent = (latest ?? []).filter((repo) => !hidden.has(repo.name.toLowerCase())).slice(0, 4);
  const repos = recent.length ? recent : profile.highlights;
  const total = count ?? profile.publicRepos;

  return (
    <Reveal as="article" delay={wide ? 0 : 90} className={cx(panel, wide && "md:col-span-2")}>
      <div className={panelHead}>
        <h3 className="type-title text-3xl">GitHub</h3>
        {total > 0 && (
          <span className="text-md text-muted">
            <CountUp value={total} /> public repositories
          </span>
        )}
      </div>
      <p className="text-md text-muted">{recent.length ? "Recently updated" : "Highlights"}</p>
      {repos.length > 0 && (
        <ul className={cx(wide && "md:grid md:grid-cols-2 md:gap-x-[clamp(28px,4vw,48px)]")}>
          {repos.map((repo) => (
            <RepoItem key={repo.url} repo={repo} wide={wide} />
          ))}
        </ul>
      )}
      {site.links.github && (
        <p className="mt-auto pt-1">
          <TextLink href={site.links.github}>See all my code on GitHub</TextLink>
        </p>
      )}
    </Reveal>
  );
}

function RepoItem({ repo, wide }: { repo: Repo; wide: boolean }) {
  const updated = repo.pushed ? new Date(repo.pushed).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "";
  return (
    <li
      className={cx(
        "grid content-start gap-0.5 border-t border-line py-3 first:border-t-0 first:pt-0",
        wide && "md:nth-2:border-t-0 md:nth-2:pt-0",
      )}
    >
      <a href={repo.url} target="_blank" rel="noopener" className="font-semibold wrap-anywhere underline-offset-4 hover:text-accent hover:underline">
        {repo.name}
      </a>
      {repo.description && <p className="text-md leading-[1.45] text-muted">{repo.description}</p>}
      <div className="flex flex-wrap gap-x-3.5 gap-y-1 text-xs text-muted empty:hidden">
        {repo.language && (
          <span className="inline-flex items-center gap-1">
            <i aria-hidden="true" className="size-2 rounded-full bg-accent" />
            {repo.language}
          </span>
        )}
        {Boolean(repo.stars) && (
          <span className="inline-flex items-center gap-1">
            <Icon name="star" />
            {formatNumber(repo.stars ?? 0)}
          </span>
        )}
        {updated && <span>Updated {updated}</span>}
      </div>
    </li>
  );
}
