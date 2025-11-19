import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url"; // robust way to get dirname

// Compute dirname compatible with ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: "/",
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },

  root: path.resolve(__dirname, "client"),

  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },

  // Preview server used by `vite preview` on Render
  preview: {
    host: "0.0.0.0",
    port: 4173,
    // allow the exact Render hostname(s) — paste the real hostnames your Render gives you
    allowedHosts: ["travelindia-frontend-3-adw3.onrender.com"],
  },

  // Dev server (local)
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    proxy:
      process.env.NODE_ENV === "production"
        ? {}
        : {
            // DEV proxy only. Make sure this host is the correct backend dev URL (check n1l0 vs n110).
            "/api": {
              target: "https://backend-n1l0.onrender.com",
              changeOrigin: true,
              secure: true,
            },
          },
  },
});
