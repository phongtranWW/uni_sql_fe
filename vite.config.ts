import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // pglite ships large WASM/data assets and uses dynamic imports internally;
  // letting Vite's dep optimiser pre-bundle it caused dev-server hangs in
  // the past. See https://pglite.dev/docs/bundler-support#vite
  optimizeDeps: {
    exclude: ["@electric-sql/pglite"],
  },
});
