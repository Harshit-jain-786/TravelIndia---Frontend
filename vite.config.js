import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },

  root: path.resolve(import.meta.dirname, "client"),

  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },

  // --- IMPORTANT FOR RENDER ---
  preview: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: ["travelindia-frontend-3-adw3.onrender.com"],
  },

  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,

    proxy:
      process.env.NODE_ENV === "production"
        ? {}
        : {
            "/api": {
              target: "https://backend-n110.onrender.com",
              changeOrigin: true,
            },
          },
  },
});
