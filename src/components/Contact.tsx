import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { site } from "../content";
import { useLocalTime } from "../hooks/useLocalTime";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";
import { Section } from "./ui";

export function Contact() {
  const { person, links, sections } = site;
  const time = useLocalTime(person.timeZone);
  const email = useRef<HTMLAnchorElement>(null);
  const city = person.location.split(",")[0];

  const rows: { label: string; value: ReactNode }[] = [];
  if (person.phone) {
    rows.push({ label: "Phone", value: <ContactLink href={`tel:${person.phone.replace(/[^\d+]/g, "")}`}>{person.phone}</ContactLink> });
  }
  if (links.linkedin) rows.push({ label: "LinkedIn", value: <ContactLink href={links.linkedin}>View my profile</ContactLink> });
  if (links.github) {
    const handle = links.github.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
    rows.push({ label: "GitHub", value: <ContactLink href={links.github}>{handle}</ContactLink> });
  }
  if (person.location) {
    const local = time ? `${time.hours}:${time.minutes} in ${city}${time.offset && `, ${time.offset}`}` : person.location;
    rows.push({ label: "Local time", value: <span className="tabular-nums">{local}</span> });
  }

  return (
    <Section id="contact">
      <Reveal className="grid items-end gap-[clamp(28px,5vw,64px)] rounded-card bg-accent-soft p-[clamp(28px,5vw,56px)] md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="grid min-w-0 gap-4.5">
          <h2 id="contact-title" className="type-title text-[clamp(2.4rem,6vw,4.2rem)] leading-none text-balance">
            {sections.contact.title}
          </h2>
          {sections.contact.intro && <p className="max-w-[52ch] text-lg text-ink/85">{sections.contact.intro}</p>}
          {person.email && (
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3.5 gap-y-2.5">
              <a
                ref={email}
                href={`mailto:${person.email}`}
                className="type-heading text-[clamp(1.3rem,3.4vw,2.1rem)] text-accent wrap-anywhere decoration-2 underline-offset-[6px] select-all hover:underline"
              >
                {person.email}
              </a>
              <CopyEmail address={person.email} target={email} />
            </div>
          )}
        </div>
        {rows.length > 0 && (
          <ul className="grid min-w-0">
            {rows.map((row) => (
              <li key={row.label} className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 border-t border-accent/22 py-3 text-md first:border-t-0">
                <span className="text-muted">{row.label}</span>
                {row.value}
              </li>
            ))}
          </ul>
        )}
      </Reveal>
    </Section>
  );
}

function ContactLink({ href, children }: { href: string; children: ReactNode }) {
  const external = /^https?:/.test(href);
  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noopener" })}
      className="inline-flex items-center gap-1 justify-self-start font-semibold wrap-anywhere underline-offset-4 hover:text-accent hover:underline"
    >
      {children}
      {external && <Icon name="arrow" />}
    </a>
  );
}

type CopyStatus = "idle" | "copied" | "selected";

/** Copies the address; without clipboard access it selects it instead. */
function CopyEmail({ address, target }: { address: string; target: RefObject<HTMLAnchorElement | null> }) {
  const [status, setStatus] = useState<CopyStatus>("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timer = setTimeout(() => setStatus("idle"), 2200);
    return () => clearTimeout(timer);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(address);
      setStatus("copied");
    } catch {
      const selection = window.getSelection();
      if (target.current && selection) {
        const range = document.createRange();
        range.selectNodeContents(target.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setStatus("selected");
    }
  }

  let label = "Copy email";
  if (status === "copied") label = "Copied";
  if (status === "selected") label = `Selected, press ${/Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘C" : "Ctrl+C"}`;

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-9.5 cursor-pointer items-center gap-1.5 rounded-full border border-accent/40 px-3.5 text-sm font-semibold text-accent transition-colors hover:bg-surface print:hidden"
    >
      <Icon key={status} name={status === "copied" ? "check" : "copy"} className={status === "copied" ? "motion-safe:animate-pop" : undefined} />
      <span aria-live="polite">{label}</span>
    </button>
  );
}
