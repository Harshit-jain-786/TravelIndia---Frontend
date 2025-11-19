const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://backend-n110.onrender.com"; // your backend

async function throwIfResNotOk(res) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;

    if (res.status === 401 && text.includes("token")) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }

    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(method, url, data) {
  const token = localStorage.getItem("accessToken");

  // build full backend URL
  const fullUrl =
    API_URL.replace(/\/$/, "") + "/" + url.replace(/^\//, "");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(fullUrl, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  return res;
}
