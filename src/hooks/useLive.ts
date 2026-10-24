import { useCallback, useSyncExternalStore } from "react";
import { peek, refresh, watch } from "../lib/live";

/**
 * Live data for `key`, kept fresh while the page is open (see lib/live.ts).
 * Null until it first arrives, and always null in the prerendered HTML.
 * Pass `url: null` to skip loading. `pick` must be a stable function.
 */
export function useLive<Json, T>(key: string, url: string | null, pick: (json: Json) => T | null, maxAge: number): T | null {
  const subscribe = useCallback(
    (onChange: () => void) => (url ? watch(key, onChange, () => refresh(key, url, pick, maxAge), maxAge) : () => {}),
    [key, url, pick, maxAge],
  );
  const value = useSyncExternalStore(subscribe, () => peek<T>(key), () => null);
  return url ? value : null;
}
