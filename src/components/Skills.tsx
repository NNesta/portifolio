import { site } from "../content";
import { Reveal } from "./Reveal";
import { Section, SectionHead } from "./ui";

export function Skills() {
  return (
    <Section id="skills">
      <SectionHead id="skills" />
      <div>
        {site.skills.map((group) => (
          <div
            key={group.group}
            className="grid gap-x-[clamp(24px,4vw,56px)] gap-y-2.5 border-t border-line py-6 last:border-b sm:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]"
          >
            <Reveal>
              <h3 className="type-heading text-xl leading-[1.2]">{group.group}</h3>
              {group.note && <p className="mt-1 text-md text-muted">{group.note}</p>}
            </Reveal>
            {/* The skills arrive one after another, left to right. */}
            <Reveal as="ul" stagger aria-label={group.group} className="flex flex-wrap content-start gap-2">
              {group.items.map((skill, i) => (
                <li key={skill} style={{ "--i": i }} className="rounded-full border border-line bg-surface px-3 py-1.25 text-md font-medium">
                  {skill}
                </li>
              ))}
            </Reveal>
          </div>
        ))}
      </div>
    </Section>
  );
}
