import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { site } from "../content";
import { useActiveSection } from "../hooks/useActiveSection";
import { useScrolled } from "../hooks/useScrolled";
import { useTheme } from "../hooks/useTheme";
import { toggleTheme } from "../lib/theme";
import { cx } from "../lib/utils";
import { Icon } from "./Icon";
import { ButtonLink } from "./ui";

const MENU = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

// Page order. A section without a menu item lights the item above it.
const SECTIONS = ["top", "work", "experience", "principles", "skills", "about", "practice", "contact"];

function menuItemFor(section: string | null) {
  const index = section ? SECTIONS.indexOf(section) : -1;
  return MENU.findLast((item) => SECTIONS.indexOf(item.id) <= index)?.id ?? null;
}

const iconButton =
  "inline-grid size-10 cursor-pointer place-items-center rounded-control border border-line bg-surface text-ink transition-colors hover:border-accent hover:text-accent";

export function Header() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const theme = useTheme();
  const current = menuItemFor(useActiveSection(SECTIONS));
  const { cv } = site.links;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Keep the browser toolbar the same color as the page.
  useEffect(() => {
    const paper = getComputedStyle(document.documentElement).getPropertyValue("--paper").trim();
    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) meta.setAttribute("content", paper);
  }, [theme]);

  return (
    <header
      className={cx(
        "sticky top-[env(safe-area-inset-top,0px)] z-50 border-b bg-paper/86 backdrop-blur-md backdrop-saturate-[1.4] transition-colors duration-200 print:hidden",
        scrolled || open ? "border-line" : "border-transparent",
      )}
    >
      <div className="wrap flex h-16 items-center gap-5">
        <a href="#top" className="type-heading mr-auto text-lg whitespace-nowrap">
          {site.person.name}
        </a>
        <Menu open={open} current={current} onNavigate={() => setOpen(false)} />
        <div className="flex items-center gap-2">
          {cv && (
            <ButtonLink href={cv} variant="ghost" small blank className="max-md:hidden">
              View CV
            </ButtonLink>
          )}
          <button
            type="button"
            className={iconButton}
            onClick={toggleTheme}
            aria-pressed={theme === "dark"}
            aria-label="Dark theme"
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {/* Both icons are always there; CSS shows the right one, so it's correct before React loads. */}
            <span className="grid *:[grid-area:1/1]">
              <Icon name="moon" className="transition duration-300 dark:scale-50 dark:-rotate-90 dark:opacity-0" />
              <Icon name="sun" className="scale-50 rotate-90 opacity-0 transition duration-300 dark:scale-100 dark:rotate-0 dark:opacity-100" />
            </span>
          </button>
          <button
            type="button"
            className={cx(iconButton, "md:hidden")}
            aria-controls="site-nav"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>
    </header>
  );
}

interface MenuProps {
  open: boolean;
  current: string | null;
  onNavigate: () => void;
}

/** Inline links on wide screens, a drop-down on phones. */
function Menu({ open, current, onNavigate }: MenuProps) {
  const nav = useRef<HTMLElement>(null);
  const links = useRef(new Map<string, HTMLAnchorElement>());
  const [bar, setBar] = useState({ x: 0, width: 0, visible: false, slide: false });
  const { cv } = site.links;

  // One underline that slides to the current item, rather than one per item.
  useLayoutEffect(() => {
    const el = nav.current;
    if (!el) return;
    const place = () => {
      const link = current ? links.current.get(current) : undefined;
      setBar((prev) => {
        if (!link) return { ...prev, visible: false, slide: false };
        const x = link.offsetLeft + 12, width = link.offsetWidth - 24;
        if (prev.visible && prev.x === x && prev.width === width) return prev;
        return { x, width, visible: true, slide: prev.visible };
      });
    };
    place();
    const resize = new ResizeObserver(place); // also catches the web fonts arriving
    resize.observe(el);
    return () => resize.disconnect();
  }, [current]);

  return (
    <nav
      ref={nav}
      id="site-nav"
      aria-label="Main"
      className={cx(
        "md:relative md:flex md:items-center md:gap-1",
        "max-md:absolute max-md:inset-x-0 max-md:top-full max-md:grid max-md:gap-0.5 max-md:border-b max-md:border-line max-md:bg-paper max-md:pt-2.5 max-md:pr-[max(20px,env(safe-area-inset-right,0px))] max-md:pb-4 max-md:pl-[max(20px,env(safe-area-inset-left,0px))] max-md:shadow-card max-md:transition-[opacity,translate,visibility] max-md:duration-200",
        !open && "max-md:invisible max-md:-translate-y-2 max-md:opacity-0",
      )}
    >
      {MENU.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          ref={(el) => {
            if (el) links.current.set(id, el);
            else links.current.delete(id);
          }}
          aria-current={current === id ? "true" : undefined}
          onClick={onNavigate}
          className="rounded-lg px-3 py-2 text-md font-medium text-muted transition-colors hover:bg-accent-soft hover:text-ink aria-[current=true]:text-ink max-md:p-3 max-md:text-base max-md:aria-[current=true]:bg-accent-soft"
        >
          {label}
        </a>
      ))}
      {cv && (
        <a href={cv} target="_blank" rel="noopener" onClick={onNavigate} className="rounded-lg p-3 text-base font-semibold text-accent hover:bg-accent-soft md:hidden">
          View CV
        </a>
      )}
      <span
        aria-hidden="true"
        className={cx(
          "pointer-events-none absolute bottom-1.25 left-0 h-0.5 w-px origin-left bg-accent max-md:hidden",
          bar.slide ? "transition-[translate,scale,opacity] duration-500 ease-[var(--ease)]" : "transition-opacity duration-300",
        )}
        style={{ opacity: bar.visible ? 1 : 0, translate: `${bar.x}px 0`, scale: `${bar.width} 1` }}
      />
    </nav>
  );
}
