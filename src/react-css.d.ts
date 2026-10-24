// Lets components set CSS custom properties inline, e.g. style={{ "--delay": "120ms" }}.
import "react";

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
