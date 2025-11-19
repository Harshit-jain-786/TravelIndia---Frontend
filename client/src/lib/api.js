import { API_URL } from "./config";

// build full URL
export function apiPath(path) {
  if (!path) return API_URL;
  return `${API_URL}${path.startsWith("/") ? path : "/" + path}`;
}

// fetch wrapper
export async function get(path) {
  const res = await fetch(apiPath(path));
  if (!res.ok) throw new Error("Failed: " + res.status);
  return res.json();
}

export async function post(path, body) {
  const res = await fetch(apiPath(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed: " + res.status);
  return res.json();
}
