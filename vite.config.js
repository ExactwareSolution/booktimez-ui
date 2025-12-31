import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
// Do not use the `@tailwindcss/vite` plugin — it may import internal Vite
// modules that are incompatible with Vite 5. Tailwind v4 uses a PostCSS
// adapter (`@tailwindcss/postcss`) which is configured in `postcss.config.cjs`.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // allow external access
    port: 5173,

    // 👇 THIS IS THE KEY LINE
    allowedHosts: [
      "localhost",
      ".booktimez.com", // allows ALL subdomains
    ],
  },
});
