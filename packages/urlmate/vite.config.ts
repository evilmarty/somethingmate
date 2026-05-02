import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    // Prefer the ESM entry over the browser CSS bundle so that @tailwindcss/vite
    // can load daisyui as a JS plugin (daisyui ships "browser": "./daisyui.css"
    // which Node's ESM loader cannot handle).
    mainFields: ["module", "browser", "jsnext:main", "jsnext"],
  },
});
