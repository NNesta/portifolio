import { useEffect, useRef, useState } from "react";
import { site } from "../content";
import { useLocalTime } from "../hooks/useLocalTime";
import { useCodewars } from "../hooks/useStats";
import { formatNumber, initials } from "../lib/utils";
import { Contours } from "./Contours";
import { Icon } from "./Icon";
import { ButtonLink, TextLink } from "./ui";

/** Entrance timing: each part of the hero rises in a beat after the last. */
const at = (ms: number) => ({ "--delay": `${ms}ms` });

export function Hero() {
  const { person, hero, facts, links } = site;
  const codewars = useCodewars();
  const profiles = [
    { label: "GitHub", url: links.github },
    { label: "LinkedIn", url: links.linkedin },
    { label: "Codewars", url: links.codewars },
  ].filter((p) => p.url);

  return (
    <section id="top" aria-label="Introduction" className="relative isolate overflow-hidden pt-[clamp(36px,7vw,88px)] pb-[clamp(32px,5vw,56px)]">
      <Contours />
      <div className="wrap">
        <div className="grid items-center gap-[clamp(28px,5vw,64px)] md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="grid min-w-0 justify-items-start gap-5.5">
            {hero.availability && (
              <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pr-3.5 pl-3 text-sm font-medium motion-safe:animate-rise">
                <span aria-hidden="true" className="relative flex size-2">
                  <span className="absolute inset-0 rounded-full bg-live opacity-60 motion-safe:animate-beacon" />
                  <span className="relative size-2 rounded-full bg-live shadow-[0_0_0_4px_color-mix(in_srgb,var(--live)_22%,transparent)]" />
                </span>
                {hero.availability}
              </p>
            )}

            {/* Each word rises out of its own line, like type being set. */}
            <h1 className="type-display mt-1 mb-0.5 text-display leading-[0.88]">
              {person.name.trim().split(/\s+/).map((word, i) => (
                <span key={i} className="-mb-[0.16em] block overflow-hidden pb-[0.16em]">
                  <span className="block motion-safe:animate-word" style={at(90 + i * 110)}>
                    {word}
                  </span>
                </span>
              ))}
            </h1>

            {person.role && (
              <p className="type-subhead text-[clamp(1.25rem,2.4vw,1.6rem)] leading-tight text-accent motion-safe:animate-rise" style={at(300)}>
                {person.role}
              </p>
            )}
            {hero.intro && (
              <p className="max-w-[56ch] text-[clamp(1.0625rem,1.5vw,1.1875rem)] text-muted motion-safe:animate-rise" style={at(380)}>
                {hero.intro}
              </p>
            )}
            <div className="flex flex-wrap gap-3 motion-safe:animate-rise" style={at(460)}>
              <ButtonLink href="#work">See my work</ButtonLink>
              {links.cv && (
                <ButtonLink href={links.cv} variant="ghost" blank icon="file">
                  View CV
                </ButtonLink>
              )}
            </div>
            {profiles.length > 0 && (
              <ul aria-label="Profiles" className="flex flex-wrap gap-x-5 gap-y-1.5 text-md motion-safe:animate-rise" style={at(540)}>
                {profiles.map((p) => (
                  <li key={p.label}>
                    <TextLink href={p.url}>{p.label}</TextLink>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <figure className="relative m-0 w-[min(100%,380px)] justify-self-end motion-safe:animate-rise max-md:order-first max-md:w-44 max-md:justify-self-start max-xs:w-33" style={at(180)}>
            <div className="aspect-[4/5] overflow-hidden rounded-card border border-line bg-accent-soft shadow-card max-md:rounded-[18px]">
              <Photo />
            </div>
            {person.location && <LocalTimeCard />}
          </figure>
        </div>

        {facts.length > 0 && (
          <dl className="mt-[clamp(32px,5vw,56px)] grid grid-cols-2 border-t border-line md:grid-cols-4">
            {facts.map((fact, i) => (
              <div
                key={fact.label}
                className="grid min-w-0 content-start gap-0.5 border-line pt-4.5 pr-5 pb-1 motion-safe:animate-rise even:border-l even:pl-5 nth-[n+3]:mt-3.5 nth-[n+3]:border-t md:not-first:border-l md:not-first:pl-5 md:nth-[n+3]:mt-0 md:nth-[n+3]:border-t-0"
                style={at(640 + i * 70)}
              >
                <dt className="text-sm text-muted">{fact.label}</dt>
                <dd className="leading-[1.4] font-semibold">
                  {fact.live === "codewars" && codewars
                    ? `${codewars.rank}, ${formatNumber(codewars.completed)} kata solved`
                    : fact.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}

/** Falls back to initials if the photo can't load. */
function Photo() {
  const { photo, photoAlt, name } = site.person;
  const img = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  // A photo that failed before React took over the page never fires onError.
  useEffect(() => {
    if (img.current?.complete && img.current.naturalWidth === 0) setFailed(true);
  }, []);

  if (!photo || failed) {
    return (
      <div role="img" aria-label={name} className="type-display grid size-full place-items-center text-[clamp(4rem,9vw,6.5rem)] text-accent max-md:text-[3.6rem]">
        {initials(name)}
      </div>
    );
  }
  return (
    <img
      ref={img}
      src={photo}
      alt={photoAlt || name}
      width={640}
      height={800}
      decoding="async"
      fetchPriority="high"
      onError={() => setFailed(true)}
      className="size-full object-cover"
    />
  );
}

/** "14:05 local time (GMT+2)", with a softly blinking colon. */
function LocalTimeCard() {
  const { location, timeZone } = site.person;
  const time = useLocalTime(timeZone);
  return (
    <figcaption
      className="absolute bottom-5.5 -left-4.5 grid gap-px rounded-xl border border-line bg-surface px-4 pt-2.5 pb-2.75 text-sm leading-[1.35] shadow-card motion-safe:animate-rise max-md:bottom-2 max-md:left-[calc(100%+16px)] max-md:w-max max-md:max-w-[calc(100vw-176px-56px)] max-md:shadow-none max-xs:max-w-[calc(100vw-132px-52px)] max-xs:px-3 max-xs:py-2"
      style={at(700)}
    >
      <span className="inline-flex items-center gap-1.5 font-semibold">
        <Icon name="pin" className="text-accent" />
        {location}
      </span>
      <span className="text-muted tabular-nums">
        {time ? (
          <>
            {time.hours}
            <span className="motion-safe:animate-blink">:</span>
            {time.minutes} local time{time.offset && ` (${time.offset})`}
          </>
        ) : (
          " "
        )}
      </span>
    </figcaption>
  );
}
