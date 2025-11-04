// Central API URL configuration
// Priority (highest -> lowest):
// 1. Vite env var `VITE_API_URL` (set at build time)
// 2. runtime override `window.__API_URL__` (optional, injected by host)
// 3. import.meta.env.PROD -> production backend URL
// 4. fallback to localhost for development
const VITE_API = import.meta.env.VITE_API_URL;
const RUNTIME_API = typeof window !== 'undefined' ? window.__API_URL__ : undefined;

export const API_URL =
  (VITE_API && String(VITE_API).trim()) ||
  (RUNTIME_API && String(RUNTIME_API).trim()) ||
  (import.meta.env.PROD
    ? 'https://backend-8-4eax.onrender.com/api'
    : 'http://localhost:8000/api');

// Helper to build full API paths
export function apiPath(path) {
  // ensure no double slashes
  return `${API_URL}${path.startsWith('/') ? path : '/' + path}`;
}
