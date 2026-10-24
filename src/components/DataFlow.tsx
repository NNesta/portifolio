import { useCallback, useEffect, useState } from "react";
import { isBelowFold, observe, prefersReducedMotion } from "../lib/motion";
import { cx } from "../lib/utils";
import type { FlowStep } from "../types";

const DOT = 26; // diameter of a step's number, px
const ARRIVE = "550ms"; // a step lights up as the reading reaches it
const WAIT_MS = {
  empty: 900, // before a new reading enters
  step: 1100, // travel to the next step, then pause there
  full: 2600, // every step lit, before the next reading
};

type StepState = "done" | "current" | "next";

/**
 * The featured project's pipeline, drawn as numbered steps. While it is on
 * screen, a reading travels down the steps one at a time and each step lights
 * up as the reading arrives. Without motion (or before JavaScript loads)
 * every step simply shows as lit.
 */
export function DataFlow({ title, steps }: { title: string; steps: FlowStep[] }) {
  const total = steps.length;
  const [reached, setReached] = useState(total); // how many steps this reading has reached
  const [playing, setPlaying] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [centers, setCenters] = useState<number[]>([]); // y of each step's number

  const ref = useCallback((list: HTMLOListElement | null) => {
    if (!list || prefersReducedMotion()) return;
    const measure = () => setCenters(Array.from(list.children, (li) => (li as HTMLElement).offsetTop + DOT / 2));
    const resize = new ResizeObserver(measure);
    resize.observe(list);
    setPlaying(true);
    if (isBelowFold(list)) setReached(0); // start empty, so the first reading is seen entering
    const stop = observe(list, (entry) => setOnScreen(entry.isIntersecting), { threshold: 0.35 });
    return () => {
      resize.disconnect();
      stop();
    };
  }, []);

  useEffect(() => {
    if (!playing || !onScreen) return;
    let wait = WAIT_MS.step;
    if (reached === 0) wait = WAIT_MS.empty;
    if (reached === total) wait = WAIT_MS.full;
    const timer = setTimeout(() => setReached((r) => (r >= total ? 0 : r + 1)), wait);
    return () => clearTimeout(timer);
  }, [playing, onScreen, reached, total]);

  const top = centers[0] ?? 0;
  const length = (centers[total - 1] ?? 0) - top;
  const at = centers[Math.max(reached - 1, 0)] ?? top;

  return (
    <aside aria-label={title} className="min-w-0 self-start rounded-xl border border-line bg-paper p-6">
      {title && <h4 className="type-heading mb-4.5 text-base leading-[1.3] text-balance">{title}</h4>}
      <div className="relative isolate">
        {playing && length > 0 && (
          <>
            {/* The path behind the reading fills in as it travels. */}
            <span
              aria-hidden="true"
              className="absolute left-3 z-[1] w-0.5 origin-top bg-accent transition-[scale] duration-700 ease-in-out"
              style={{ top, height: length, scale: `1 ${reached > 0 ? (at - top) / length : 0}` }}
            />
            {/* The reading itself. It hides under each number, so it only shows in transit. */}
            <span
              aria-hidden="true"
              className={cx(
                "absolute top-0 left-2.25 z-[1] size-2 rounded-full bg-accent shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_25%,transparent)]",
                reached > 1 ? "transition-[translate,opacity] duration-700 ease-in-out" : "transition-opacity duration-300",
              )}
              style={{ translate: `0 ${at - 4}px`, opacity: reached > 0 ? 1 : 0 }}
            />
          </>
        )}
        <ol ref={ref} className="grid">
          {steps.map((step, i) => {
            let state: StepState = "done";
            if (playing && i === reached - 1) state = "current";
            if (playing && i >= reached) state = "next";
            const arriving = state === "current" && i > 0 ? { transitionDelay: ARRIVE } : undefined;
            return (
              <li
                key={step.step}
                data-state={state}
                className="group relative grid gap-px pb-4.5 pl-10 after:absolute after:top-7.5 after:bottom-1 after:left-[12.5px] after:w-px after:bg-line last:pb-0 last:after:hidden"
              >
                <span
                  className="absolute top-0 left-0 z-[2] grid size-6.5 place-items-center rounded-full border border-accent bg-accent text-xs font-bold text-accent-ink tabular-nums transition-colors duration-300 group-data-[state=next]:bg-paper group-data-[state=next]:text-accent"
                  style={arriving}
                >
                  {i + 1}
                  {state === "current" && (
                    <span className="absolute -inset-px rounded-full motion-safe:animate-arrive" style={{ "--delay": i > 0 ? ARRIVE : "0ms" }} />
                  )}
                </span>
                <strong className="leading-[1.6] font-semibold transition-colors duration-300 group-data-[state=current]:text-accent" style={arriving}>
                  {step.step}
                </strong>
                {step.note && <span className="text-md leading-[1.45] text-muted">{step.note}</span>}
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}
