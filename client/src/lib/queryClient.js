import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res) {
    if (!res.ok) {
        const text = (await res.text()) || res.statusText;
        // If 401 and token error, clear token and reload
        if (res.status === 401 && text.includes('token')) {
            localStorage.removeItem('accessToken');
            // Optionally, redirect to login page instead of reload
            window.location.reload();
        }
        throw new Error(`${res.status}: ${text}`);
    }
}




export async function apiRequest(method, url, data) {
    const token = localStorage.getItem("accessToken");
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    };
    // Use relative URL so Vite proxy works
    const relUrl = url.startsWith("/") ? url : "/" + url;
    const res = await fetch(relUrl, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
    });

    await throwIfResNotOk(res);
    return res;
}

export const getQueryFn =
    ({ on401: unauthorizedBehavior }) =>
        async ({ queryKey }) => {

            const token = localStorage.getItem("accessToken");
            const headers = token ? { "Authorization": `Bearer ${token}` } : {};

            // Only use string/number segments for URL, use relative path for proxy
            const url = `/${queryKey.filter(x => typeof x === 'string' || typeof x === 'number').join("/")}`.replace(/\/\/+/, '/');
            const res = await fetch(url, {
                headers,
            });

            if (unauthorizedBehavior === "returnNull" && res.status === 401) {
                return null;
            }

            await throwIfResNotOk(res);
            return await res.json();
        };

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: getQueryFn({ on401: "throw" }),
            refetchInterval: false,
            refetchOnWindowFocus: false,
            staleTime: Infinity,
            retry: false,
        },
        mutations: {
            retry: false,
        },
    },
});
