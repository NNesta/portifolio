import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { site } from "./content";
import "./index.css";

const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Built pages arrive prerendered (scripts/prerender.js), so React only has
// to attach to the HTML that is already there. The dev server sends an
// empty page, so React draws it from scratch.
if (container.firstElementChild) hydrateRoot(container, app);
else createRoot(container).render(app);

console.info(
  "%cHello, fellow developer.",
  "font: 600 14px/1.6 system-ui",
  `\nThis page is React, Vite and Tailwind CSS. The animations are plain CSS and a canvas, no animation library.\n${site.links.source || site.links.github}`,
);
