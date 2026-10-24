import { site } from "../content";
import type { Featured, Project } from "../types";
import { DataFlow } from "./DataFlow";
import { Reveal } from "./Reveal";
import { Chips, Pill, Section, SectionHead, TextLink, Ticks } from "./ui";

export function Work() {
  const { featured, projects } = site;
  return (
    <Section id="work">
      <SectionHead id="work" />
      {featured && <FeaturedProject project={featured} />}
      {projects.length > 0 && (
        <div className="mt-[clamp(40px,5vw,64px)] grid gap-x-[clamp(28px,5vw,64px)] sm:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard key={project.name} project={project} delay={(i % 2) * 90} />
          ))}
        </div>
      )}
    </Section>
  );
}

function FeaturedProject({ project: f }: { project: Featured }) {
  return (
    <Reveal
      as="article"
      className="grid gap-[clamp(28px,4vw,56px)] rounded-card border border-line bg-surface p-[clamp(24px,4vw,48px)] shadow-card md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] print:shadow-none"
    >
      <div className="grid min-w-0 content-start gap-4.5">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-medium text-muted">
          <span>{[f.role, f.org].filter(Boolean).join(" at ")}</span>
          {f.status && <Pill>{f.status}</Pill>}
        </p>
        <h3 className="type-title text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.04] text-balance">{f.name}</h3>
        {f.summary && <p className="max-w-[58ch] text-lg">{f.summary}</p>}
        <Ticks items={f.points} />
        <Chips items={f.stack} />
        {f.url && (
          <p>
            <TextLink href={f.url}>{f.linkLabel || f.url}</TextLink>
          </p>
        )}
      </div>
      {f.flow.length > 0 && <DataFlow title={f.flowTitle} steps={f.flow} />}
    </Reveal>
  );
}

function ProjectCard({ project: p, delay }: { project: Project; delay: number }) {
  return (
    <Reveal
      as="article"
      delay={delay}
      className="group/card relative grid min-w-0 grid-rows-[auto_1fr_auto_auto] gap-3 border-t border-line pt-7 pb-8"
    >
      {/* On hover, an accent line sweeps along the top rule. */}
      <span
        aria-hidden="true"
        className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-accent transition-[scale] duration-500 ease-(--ease) group-hover/card:scale-x-100"
      />
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="type-title text-4xl leading-[1.1]">{p.name}</h3>
        {p.type && <span className="text-sm font-medium text-muted">{p.type}</span>}
      </div>
      <p className="max-w-[56ch]">{p.description}</p>
      <Chips items={p.stack} />
      {p.links.length > 0 && (
        <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-md">
          {p.links.map((link) => (
            <li key={link.url}>
              <TextLink href={link.url}>{link.label}</TextLink>
            </li>
          ))}
        </ul>
      )}
    </Reveal>
  );
}
