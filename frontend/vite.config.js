import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Required for Electron: use relative asset paths so index.html loads
  // correctly when opened as a local file (file://) inside the desktop app.
  base: "./",
});