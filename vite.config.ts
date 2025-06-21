import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const currentFile = fileURLToPath(import.meta.url);
const __dirname = path.dirname(currentFile);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
    },
  },
});
