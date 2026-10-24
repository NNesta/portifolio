import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

/** Renders the whole page to HTML at build time (see scripts/prerender.js). */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
