import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "wawa-lipsync": path.resolve(
        __dirname,
        "../../packages/wawa-lipsync/src"
      ),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5175,
  },
  plugins: [react(), tailwindcss()],
});
