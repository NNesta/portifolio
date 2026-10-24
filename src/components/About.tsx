import { site } from "../content";
import { Reveal } from "./Reveal";
import { Section, SectionHead } from "./ui";

export function About() {
  const { about, learning, languages } = site;
  return (
    <Section id="about">
      <SectionHead id="about" />
      <div className="grid items-start gap-[clamp(32px,6vw,80px)] md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <Reveal className="grid max-w-[62ch] gap-4.5 text-lg">
          {about.map((text, i) => (
            <p key={text} className={i === 0 ? "type-subhead text-[clamp(1.35rem,2.4vw,1.65rem)] leading-[1.35]" : undefined}>
              {text}
            </p>
          ))}
        </Reveal>
        <div className="grid min-w-0 gap-7">
          {learning.length > 0 && (
            <Reveal delay={90}>
              <h3 className="type-heading mb-2 text-lg">Education and training</h3>
              <ul>
                {learning.map((item) => (
                  <li key={item.title} className="grid gap-0.5 border-t border-line py-3.5 last:border-b">
                    <strong className="leading-[1.4] font-semibold">{item.title}</strong>
                    <span className="text-md leading-[1.45] text-muted">{[item.org, item.period].filter(Boolean).join(", ")}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
          {languages.length > 0 && (
            <Reveal delay={180}>
              <h3 className="type-heading mb-2 text-lg">Languages</h3>
              <ul className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <li key={lang.name} className="rounded-full bg-accent-soft px-3.5 py-1.5 text-md">
                    {lang.name}
                    {lang.level && <span className="text-muted"> {lang.level}</span>}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  );
}
