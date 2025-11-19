// client/src/lib/queryClient.js
import { QueryClient } from "@tanstack/react-query";

export const API_URL = (import.meta.env.VITE_API_URL || "https://backend-n110.onrender.com").replace(/\/$/, "");

async function parseJsonSafe(res) {
  const text = await res.text().catch(() => "");
  try { return text ? JSON.parse(text) : null; } catch { return text; }
}

export async function apiRequest(method = "GET", path = "/", body) {
  const normalizedPath = path.startsWith("/") ? path : "/" + path;
  const url = API_URL + normalizedPath;
  const token = localStorage.getItem("accessToken");
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await parseJsonSafe(res);

  if (res.status === 401) {
    // optional: clear tokens so UI can react
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  if (!res.ok) {
    const message = (data && (data.detail || data.message)) || `${res.status} ${res.statusText}`;
    const err = new Error(message);
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return { status: res.status, ok: res.ok, data };
}

export const getQueryFn = ({ on401 = "throw" } = {}) => async ({ queryKey }) => {
  const token = localStorage.getItem("accessToken");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const urlPath = "/" + queryKey.filter(x => typeof x === "string" || typeof x === "number").join("/").replace(/\/+/g, "/");
  const fullUrl = API_URL + urlPath;
  const res = await fetch(fullUrl, { headers });

  if (res.status === 401 && on401 === "returnNull") return null;
  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    const e = new Error(`${res.status}: ${txt}`);
    e.status = res.status;
    throw e;
  }
  return res.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5
    },
    mutations: { retry: false }
  }
});

export default queryClient;
