// Helpers for the scroll animations. They read the browser, so call them
// from effects and ref callbacks, never while rendering.

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True when the element starts below the visible part of the page. */
export const isBelowFold = (el: Element) => el.getBoundingClientRect().top > window.innerHeight;

/** Eases from one number to another; returns a function that stops it. */
export function tween(from: number, to: number, duration: number, onFrame: (value: number) => void) {
  const start = performance.now();
  let frame = requestAnimationFrame(function step(now) {
    const p = duration > 0 ? Math.min(1, (now - start) / duration) : 1;
    onFrame(from + (to - from) * (1 - (1 - p) ** 4));
    if (p < 1) frame = requestAnimationFrame(step);
  });
  return () => cancelAnimationFrame(frame);
}

type Listener = (entry: IntersectionObserverEntry) => void;
const pools = new Map<string, { observer: IntersectionObserver; listeners: Map<Element, Listener> }>();

/**
 * Calls `listener` when the element enters or leaves the viewport.
 * Elements with the same options share one IntersectionObserver, so the
 * whole page runs a handful of observers instead of one per element.
 * Returns a function that stops watching.
 */
export function observe(el: Element, listener: Listener, { rootMargin = "0px", threshold = 0 } = {}) {
  const key = `${rootMargin}|${threshold}`;
  let pool = pools.get(key);
  if (!pool) {
    const listeners = new Map<Element, Listener>();
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => listeners.get(entry.target)?.(entry)),
      { rootMargin, threshold },
    );
    pool = { observer, listeners };
    pools.set(key, pool);
  }
  const { observer, listeners } = pool;
  listeners.set(el, listener);
  observer.observe(el);
  return () => {
    observer.unobserve(el);
    listeners.delete(el);
  };
}
