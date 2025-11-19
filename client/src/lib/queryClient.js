// client/src/lib/apiClient.js
export const API_URL = (import.meta.env.VITE_API_URL || "https://backend-n110.onrender.com").replace(/\/$/, "");

async function parseJsonSafe(res) {
  const text = await res.text().catch(() => "");
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

export async function apiRequest(method = "GET", path = "/", body = undefined) {
  // path may be '/api/users/login/' OR 'api/users/login' — normalize it
  const normalizedPath = (path.startsWith("/") ? path : "/" + path);
  const url = API_URL + normalizedPath;

  const token = localStorage.getItem("accessToken");
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    // credentials: "include"  // enable only if using cookie auth
  });

  const data = await parseJsonSafe(res);

  // handle common auth case
  if (res.status === 401) {
    // backend said token invalid; clear and force login
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Do NOT forcibly reload if you don't want that behaviour; up to you:
    // window.location.href = "/login";
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
