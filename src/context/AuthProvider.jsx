// src/context/AuthProvider.jsx
import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return null; // sécurité SSR éventuelle
    return localStorage.getItem("token");
  });

  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (token && user) {
      localStorage.setItem("token", token.toString());
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token, user]);

  useEffect(() => {
    if (!token) return;

    try {
      const payload = jwtDecode(token);
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        this.logout();
      } else if (!user) {
        setUser(payload);
      }
    } catch (err) {
      console.error(err);
      logout();
    }
  }, [token, user]);

  const login = (jwt) => {
    const payload = jwtDecode(jwt);
    setToken(jwt);
    setUser(payload);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
