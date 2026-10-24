// The theme lives on <html data-theme>, set before first paint by the
// script in index.html. With no saved choice, the system setting wins.

import { prefersReducedMotion } from "./motion";

export type Theme = "light" | "dark";

let darkQuery: MediaQueryList | undefined;
const systemDark = () => (darkQuery ??= window.matchMedia("(prefers-color-scheme: dark)"));

export function readTheme(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "light" || chosen === "dark") return chosen;
  return systemDark().matches ? "dark" : "light";
}

/** Calls `onChange` when the visitor or the system switches theme. */
export function subscribeTheme(onChange: () => void) {
  const query = systemDark();
  const watcher = new MutationObserver(onChange);
  query.addEventListener("change", onChange);
  watcher.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => {
    query.removeEventListener("change", onChange);
    watcher.disconnect();
  };
}

/** Switches theme, remembers the choice and cross-fades where supported. */
export function toggleTheme() {
  const next: Theme = readTheme() === "dark" ? "light" : "dark";
  const apply = () => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private mode or blocked storage: the switch still works for this visit.
    }
  };
  if (document.startViewTransition && !prefersReducedMotion()) document.startViewTransition(apply);
  else apply();
}
