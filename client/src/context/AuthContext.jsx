import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken"));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken"));

  // Refresh access token if expired
  useEffect(() => {
    async function refreshAccessToken() {
      if (!refreshToken) return;
      
      try {
        const res = await fetch("/api/token/refresh/", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ refresh: refreshToken }),
          credentials: 'include'
        });
        
        if (!res.ok) {
          throw new Error('Token refresh failed');
        }
        
        const data = await res.json();
        if (data.access) {
          setAccessToken(data.access);
          localStorage.setItem("accessToken", data.access);
        }
      } catch (error) {
        console.error('Failed to refresh token:', error);
        logout();
      }
    }

    // Always attempt to refresh token when component mounts
    refreshAccessToken();

    // Set up an interval to refresh the token periodically (e.g., every 29 minutes)
    const refreshInterval = setInterval(refreshAccessToken, 29 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [refreshToken]);

  function login(userData, access, refresh) {
    setUser(userData);
    setAccessToken(access);
    setRefreshToken(refresh);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
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
    <AuthContext.Provider value={{ user, accessToken, refreshToken, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
