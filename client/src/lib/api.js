// client/src/lib/api.js
// Single source-of-truth for API base URL

const rawVite = import.meta.env.VITE_API_URL;
const runtimeOverride = (typeof window !== "undefined" && window.__API_URL__) ? String(window.__API_URL__).trim() : undefined;

function normalizeBase(url) {
  if (!url) return undefined;
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

const VITE_API = rawVite ? String(rawVite).trim() : undefined;
// fallback if not set at build-time
const PROD_FALLBACK = 'https://backend-n1l0.onrender.com';

export const API_URL = normalizeBase(
  VITE_API ||
  runtimeOverride ||
  (import.meta.env.PROD ? PROD_FALLBACK : 'http://localhost:8000')
);

// ensure exactly one slash between base and path
export function apiPath(path) {
  if (!path) return API_URL;
  const clean = path.startsWith('/') ? path : '/' + path;
  return `${API_URL}${clean}`;
}
