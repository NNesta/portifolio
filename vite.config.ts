import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

// Runs api/leetcode.ts under `npm run dev`, as Vercel does in production.
// It is loaded through the dev server, so editing src/content.ts still
// updates the page instantly instead of restarting the server.
function devApi(): Plugin {
  return {
    name: "dev-api",
    configureServer(server) {
      server.middlewares.use("/api/leetcode", (_req, res, next) => {
        server
          .ssrLoadModule("/api/leetcode.ts")
          .then(async (mod) => {
            const { GET } = mod as typeof import("./api/leetcode");
            const response = await GET();
            res.statusCode = response.status;
            res.setHeader("Content-Type", "application/json");
            res.end(await response.text());
          })
          .catch(next);
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths, so the same build works at a domain root (Vercel)
  // or in a sub-folder (GitHub Pages project sites).
  base: "./",
  plugins: [react(), tailwindcss(), devApi()],
});
