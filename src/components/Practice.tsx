import { site } from "../content";
import { useLive } from "../hooks/useLive";
import { codewarsUrl, githubReposUrl, githubUserUrl, pickCodewars, pickRepoCount, pickRepos } from "../lib/live";
import { andList, formatNumber } from "../lib/utils";
import type { CodewarsProfile, GithubProfile, KyuColor, Repo } from "../types";
import { CountUp } from "./CountUp";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";
import { Section, SectionHead, TextLink } from "./ui";

const live = site.settings.liveData;
const panel = "flex min-w-0 flex-col gap-5 rounded-card border border-line bg-surface p-[clamp(22px,3.5vw,36px)]";
const panelHead = "flex flex-wrap items-center justify-between gap-x-4 gap-y-2";
const KYU: Partial<Record<KyuColor, string>> = {
  white: "var(--kyu-white)",
  yellow: "var(--kyu-yellow)",
  blue: "var(--kyu-blue)",
  purple: "var(--kyu-purple)",
};

export function Practice() {
  const { codewars, github } = site.practice;
  if (!codewars && !github) return null;
  return (
    <Section id="practice">
      <SectionHead id="practice" />
      <div className="grid gap-[clamp(16px,3vw,28px)] md:grid-cols-2">
        {codewars && <CodewarsPanel profile={codewars} />}
        {github && <GithubPanel profile={github} />}
      </div>
    </Section>
  );
}

function CodewarsPanel({ profile }: { profile: CodewarsProfile }) {
  const fresh = useLive(`cw:${profile.username}`, live ? codewarsUrl(profile.username) : null, pickCodewars);
  const rank = fresh?.rank ?? profile.rank;
  const color = KYU[fresh?.rankColor ?? profile.rankColor] ?? KYU.blue;
  const languages = andList(fresh?.languages ?? profile.languages);
  const stats = [
    { label: "Kata solved", value: fresh?.completed ?? profile.completed },
    { label: "Honor", value: fresh?.honor ?? profile.honor },
    { label: "Leaderboard", value: fresh?.leaderboard || profile.leaderboard, prefix: "#" },
  ].filter((s) => s.value > 0);

  const since = profile.memberSince && `On Codewars since ${profile.memberSince}`;
  const training = languages && `training in ${languages}`;
  let note = [since, training].filter(Boolean).join(", ");
  if (note) note = `${note.charAt(0).toUpperCase()}${note.slice(1)}.`;

  return (
    <Reveal as="article" className={panel}>
      <div className={panelHead}>
        <h3 className="type-title text-3xl">Codewars</h3>
        {rank && (
          <span
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-current py-1 pr-3 pl-1.5 text-md font-bold before:size-4.5 before:rounded-full before:bg-current"
            style={{ color }}
          >
            {rank}
          </span>
        )}
      </div>
      {stats.length > 0 && (
        <dl className="grid grid-cols-[repeat(auto-fit,minmax(5.5rem,1fr))] gap-3">
          {stats.map((s) => (
            <div key={s.label} className="grid min-w-0 gap-0.5">
              <dt className="text-sm text-muted">{s.label}</dt>
              <dd className="type-title text-[clamp(1.5rem,2.6vw,1.9rem)] leading-[1.1] tabular-nums">
                <CountUp value={s.value} prefix={s.prefix} />
              </dd>
            </div>
          ))}
        </dl>
      )}
      {note && <p className="text-md text-muted">{note}</p>}
      {site.links.codewars && (
        <p className="mt-auto pt-1">
          <TextLink href={site.links.codewars}>See my Codewars profile</TextLink>
        </p>
      )}
    </Reveal>
  );
}

function GithubPanel({ profile }: { profile: GithubProfile }) {
  const { username } = profile;
  const count = useLive(`gh:user:${username}`, live ? githubUserUrl(username) : null, pickRepoCount);
  const latest = useLive(`gh:repos:${username}`, live && profile.showLatest ? githubReposUrl(username) : null, pickRepos);

  const hidden = new Set(profile.hideRepos.map((name) => name.toLowerCase()));
  const recent = (latest ?? []).filter((repo) => !hidden.has(repo.name.toLowerCase())).slice(0, 4);
  const repos = recent.length ? recent : profile.highlights;
  const total = count ?? profile.publicRepos;

  return (
    <Reveal as="article" delay={90} className={panel}>
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
        <ul>
          {repos.map((repo) => (
            <RepoItem key={repo.url} repo={repo} />
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

function RepoItem({ repo }: { repo: Repo }) {
  const updated = repo.pushed ? new Date(repo.pushed).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "";
  return (
    <li className="grid gap-0.5 border-t border-line py-3 first:border-t-0 first:pt-0">
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
