import { site } from "../content";
import { Reveal } from "./Reveal";
import { Pill, Section, SectionHead, Ticks } from "./ui";

export function Experience() {
  return (
    <Section id="experience">
      <SectionHead id="experience" />
      <ol>
        {site.experience.map((job) => (
          <Reveal
            as="li"
            key={`${job.role} ${job.org}`}
            className="grid gap-x-[clamp(24px,4vw,56px)] gap-y-2 border-t border-line py-7 last:border-b sm:grid-cols-[minmax(0,190px)_minmax(0,1fr)]"
          >
            <div className="flex items-start text-md font-medium text-muted tabular-nums sm:pt-1">
              {job.current && /current/i.test(job.period) ? <Pill>{job.period}</Pill> : job.period}
            </div>
            <div className="grid min-w-0 gap-2.5">
              <h3 className="type-heading text-2xl leading-[1.2]">{job.role}</h3>
              <p className="text-muted">
                <strong className="font-semibold text-accent">{job.org}</strong>
                {job.place && `, ${job.place}`}
              </p>
              <Ticks items={job.points} tight />
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
