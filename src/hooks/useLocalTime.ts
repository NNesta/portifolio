import { useEffect, useMemo, useState } from "react";

export interface LocalTime {
  hours: string;
  minutes: string;
  /** For example "GMT+2". */
  offset: string;
}

/**
 * The current time in `timeZone`. It ticks on the minute, so the clock
 * changes exactly when a wall clock would. Null until the page is live:
 * the prerendered HTML has no time to show.
 */
export function useLocalTime(timeZone: string): LocalTime | null {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let timer = 0;
    const tick = () => {
      setNow(new Date());
      timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  return useMemo(() => {
    if (!now || !timeZone) return null;
    try {
      const parts = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone,
        timeZoneName: "shortOffset",
      }).formatToParts(now);
      const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
      return { hours: part("hour"), minutes: part("minute"), offset: part("timeZoneName") };
    } catch {
      return null; // unknown time zone
    }
  }, [now, timeZone]);
}
