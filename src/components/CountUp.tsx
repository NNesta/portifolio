import { useCallback, useEffect, useRef, useState } from "react";
import { isBelowFold, observe, prefersReducedMotion, tween } from "../lib/motion";
import { formatNumber } from "../lib/utils";

/**
 * A number that counts up from zero the first time it scrolls into view,
 * and eases to the new value when live data changes it. Screen readers
 * only ever hear the final number.
 */
export function CountUp({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [shown, setShown] = useState(value);
  const [seen, setSeen] = useState(true);
  const current = useRef(value);

  const ref = useCallback((el: HTMLElement | null) => {
    if (!el || prefersReducedMotion() || !isBelowFold(el)) return;
    current.current = 0;
    setShown(0);
    setSeen(false);
    const stop = observe(
      el,
      (entry) => {
        if (!entry.isIntersecting) return;
        stop();
        setSeen(true);
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    return stop;
  }, []);

  useEffect(() => {
    if (!seen || current.current === value) return;
    return tween(current.current, value, prefersReducedMotion() ? 0 : 1200, (n) => {
      current.current = n;
      setShown(Math.round(n));
    });
  }, [seen, value]);

  return (
    <span ref={ref}>
      <span aria-hidden="true">
        {prefix}
        {formatNumber(shown)}
      </span>
      <span className="sr-only">
        {prefix}
        {formatNumber(value)}
      </span>
    </span>
  );
}
