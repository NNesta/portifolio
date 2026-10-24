import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths, so the same build works at a domain root (Vercel)
  // or in a sub-folder (GitHub Pages project sites).
  base: "./",
  plugins: [react(), tailwindcss()],
});
