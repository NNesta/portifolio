import { useEffect, useState } from "react";
import { getJSON } from "../lib/live";

/**
 * Loads live data after the page is on screen. Returns null until it
 * arrives, and keeps returning null if it can't load within 7 seconds.
 * Pass `url: null` to skip loading. `pick` must be a stable function.
 */
export function useLive<Json, T>(key: string, url: string | null, pick: (json: Json) => T | null): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    getJSON(key, url, pick, controller.signal).then((result) => {
      clearTimeout(timer);
      if (result && !controller.signal.aborted) setData(result);
    });
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [key, url, pick]);

  return data;
}
