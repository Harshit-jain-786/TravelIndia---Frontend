// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "@/lib/axiosClient";
import { apiPath } from "@/lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken") || null);
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken") || null);
  const [loading, setLoading] = useState(true);

  // Keep axios Authorization header in sync when accessToken changes
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, [accessToken]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }
  }, [refreshToken]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // Refresh access token using refresh token
  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) return false;
    try {
      // Using axios client with baseURL ensures full URL correctness
      const res = await api.post('/api/token/refresh/', { refresh: refreshToken });
      if (res?.data?.access) {
        setAccessToken(res.data.access);
        // axios interceptor reads localStorage, but keep local copy
        localStorage.setItem('accessToken', res.data.access);
        return true;
      }
      return false;
    } catch (err) {
      console.error('refreshAccessToken error:', err);
      return false;
    }
  }, [refreshToken]);

  useEffect(() => {
    let mounted = true;
    async function init() {
      // try to refresh immediately if we have a refresh token
      if (refreshToken) {
        const ok = await refreshAccessToken();
        if (!ok) {
          // tokens invalid — clear
          if (mounted) {
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
          }
        }
      }
      if (mounted) setLoading(false);
    }
    init();

    // optional: periodic refresh every 29 minutes (if refreshToken exists)
    const interval = setInterval(() => {
      if (refreshToken) refreshAccessToken();
    }, 29 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [refreshToken, refreshAccessToken]);

  // login function (accepts credentials, calls backend)
  async function login(email, password) {
    try {
      const res = await api.post('/api/users/login/', { email, password });
      // expecting response contains user, access, refresh (adjust as per your backend)
      const data = res.data;
      if (!data) throw new Error('Invalid login response');

      // adapt to your backend structure; common: { user: {...}, access: '...', refresh: '...' }
      const userObj = data.user || data;
      const access = data.access || data.token || data.accessToken;
      const refresh = data.refresh || data.refreshToken;

      if (access) setAccessToken(access);
      if (refresh) setRefreshToken(refresh);
      if (userObj) setUser(userObj);

      // persist
      if (access) localStorage.setItem("accessToken", access);
      if (refresh) localStorage.setItem("refreshToken", refresh);
      if (userObj) localStorage.setItem("user", JSON.stringify(userObj));

      return { ok: true, data };
    } catch (err) {
      console.error('login error', err);
      // try to extract backend error message
      const msg = err?.response?.data || err?.message || 'Login failed';
      return { ok: false, error: msg };
    }
  }

  function logout() {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  const isAuthenticated = !!user && !!accessToken;

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, login, logout, refreshAccessToken, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
