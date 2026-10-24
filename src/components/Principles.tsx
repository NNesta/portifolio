import { site } from "../content";
import { Reveal } from "./Reveal";
import { Section, SectionHead } from "./ui";

export function Principles() {
  return (
    <Section id="principles">
      <SectionHead id="principles" />
      <ul className="grid gap-x-[clamp(28px,5vw,64px)] sm:grid-cols-2">
        {site.principles.map((p, i) => (
          <Reveal
            as="li"
            key={p.title}
            delay={(i % 2) * 90}
            className="grid min-w-0 content-start gap-2 border-t border-line pt-6.5 pb-7.5"
          >
            <h3 className="type-heading text-2xl leading-[1.2]">{p.title}</h3>
            <p className="max-w-[52ch] text-muted">{p.text}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
