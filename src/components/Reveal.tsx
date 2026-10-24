import { useCallback, useState, type HTMLAttributes } from "react";
import { isBelowFold, observe, prefersReducedMotion } from "../lib/motion";
import { cx } from "../lib/utils";

type Phase = "static" | "hidden" | "shown";

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "li" | "ul" | "article";
  /** Milliseconds to wait before fading in, to stagger neighbours. */
  delay?: number;
  /** Fade the children in one by one (each child sets --i) instead of the whole element. */
  stagger?: boolean;
}

/**
 * Fades its content up once, the first time it scrolls into view.
 * Anything already on screen when the page loads is left alone, so
 * nothing blinks above the fold, and the prerendered HTML shows all
 * content even before (or without) JavaScript.
 */
export function Reveal({ as: Tag = "div", delay = 0, stagger = false, className, style, ...props }: RevealProps) {
  const [phase, setPhase] = useState<Phase>("static");

  const ref = useCallback((el: HTMLElement | null) => {
    if (!el || prefersReducedMotion() || !isBelowFold(el)) return;
    setPhase("hidden");
    const stop = observe(
      el,
      (entry) => {
        if (!entry.isIntersecting) return;
        stop();
        setPhase("shown");
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    return stop;
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal={phase}
      className={cx(stagger ? "reveal-list" : "reveal", className)}
      style={delay ? { ...style, "--delay": `${delay}ms` } : style}
      {...props}
    />
  );
}
