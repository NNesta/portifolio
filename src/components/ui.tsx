import type { ReactNode } from "react";
import { site } from "../content";
import { cx, isExternal } from "../lib/utils";
import type { SectionId } from "../types";
import { Icon, type IconName } from "./Icon";
import { Reveal } from "./Reveal";

/** Opens outside links in a new tab. */
const newTab = (href: string) => (isExternal(href) ? { target: "_blank", rel: "noopener" } : {});

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      {...newTab(href)}
      className="group/link inline-flex items-center gap-1.25 font-semibold text-ink underline decoration-line decoration-2 underline-offset-[5px] transition-colors hover:text-accent hover:decoration-accent"
    >
      {children}
      {isExternal(href) && (
        <Icon
          name="arrow"
          size="0.95em"
          className="text-muted transition-[translate,color] duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-accent"
        />
      )}
    </a>
  );
}

interface ButtonLinkProps {
  href: string;
  variant?: "primary" | "ghost";
  small?: boolean;
  /** Open in a new tab, as for the CV. */
  blank?: boolean;
  icon?: IconName;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({ href, variant = "primary", small, blank, icon, className, children }: ButtonLinkProps) {
  return (
    <a
      href={href}
      {...(blank && { target: "_blank", rel: "noopener" })}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-control border font-semibold whitespace-nowrap transition-colors",
        small ? "min-h-10 px-3.5 text-md" : "min-h-11.5 px-5 text-[1rem]",
        variant === "primary"
          ? "border-transparent bg-accent text-accent-ink hover:bg-accent-strong"
          : "border-line bg-surface text-ink hover:border-accent hover:text-accent",
        className,
      )}
    >
      {icon && <Icon name={icon} />}
      {children}
    </a>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-live/14 px-2.5 py-0.5 text-xs font-semibold text-live before:size-1.5 before:rounded-full before:bg-current">
      {children}
    </span>
  );
}

export function Chips({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item} className="rounded-md bg-accent-soft px-2.25 py-0.75 text-xs leading-normal font-semibold text-accent">
          {item}
        </li>
      ))}
    </ul>
  );
}

/** A list with short accent dashes for bullets. */
export function Ticks({ items, tight }: { items: string[]; tight?: boolean }) {
  if (!items.length) return null;
  return (
    <ul className={cx("grid", tight ? "mt-1 gap-2" : "gap-2.5")}>
      {items.map((item) => (
        <li
          key={item}
          className="relative max-w-[64ch] pl-6.5 before:absolute before:top-[0.62em] before:left-0.5 before:h-0.5 before:w-3 before:rounded-sm before:bg-accent"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Section({ id, children }: { id: SectionId; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-line py-[clamp(56px,7.5vw,96px)] print:py-6">
      <div className="wrap">{children}</div>
    </section>
  );
}

export function SectionHead({ id }: { id: SectionId }) {
  const { title, intro } = site.sections[id];
  return (
    <Reveal className="mb-[clamp(32px,4.5vw,52px)] grid items-end gap-x-[clamp(24px,4vw,56px)] gap-y-3 sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <h2 id={`${id}-title`} className="type-title text-title leading-none text-balance">
        {title}
      </h2>
      {intro && <p className="max-w-[52ch] text-lg text-muted">{intro}</p>}
    </Reveal>
  );
}
