import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/TravelIndia/" : "/",
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
  server: {
    port: 5174,
    strictPort: true,
    // Only proxy API requests in development to the local Django server.
    // In production we rely on the absolute API_URL and do not proxy.
    proxy: process.env.NODE_ENV === 'production' ? {} : {
      "/api": {
        target: "https://backend-8-4eax.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
