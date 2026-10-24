import { useSyncExternalStore } from "react";
import { readTheme, subscribeTheme, type Theme } from "../lib/theme";

// The prerendered page can't know the visitor's theme, so the server
// snapshot says "light"; React swaps in the real value as it hydrates.
const serverTheme = (): Theme => "light";

export function useTheme(): Theme {
  return useSyncExternalStore(subscribeTheme, readTheme, serverTheme);
}
