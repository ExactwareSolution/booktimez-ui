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
    host: true,
    port: 5173,
    allowedHosts: [
      "localhost",
      ".booktimez.com",
      "zd4hf92j-5173.inc1.devtunnels.ms",
    ],
  },
});
