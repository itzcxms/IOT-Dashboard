// src/context/AuthProvider.jsx
import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode";

export default function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  });

  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Gestion du token et de l'utilisateur dans le localStorage
  useEffect(() => {
    if (token && user) {
      localStorage.setItem("token", token.toString());
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token, user]);

  const login = (jwt) => {
    try {
      const payload = jwtDecode(jwt);
      setToken(jwt);
      const normalized = {
        ...payload,
        id: payload.id ?? payload._id ?? payload.sub,
      };
      setUser(normalized);
    } catch (err) {
      console.error("Erreur lors de la connexion:", err);
      throw new Error("Token invalide");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Vérification de l'expiration du token et du statut actif
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const payload = jwtDecode(token);

      // Vérifier l'expiration du token
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        console.warn("Token expiré");
        logout();
        return;
      }

      // Vérifier si l'utilisateur est actif
      if (payload.actif === false) {
        console.warn("Utilisateur inactif");
        logout();
        return;
      }

      if (!user) {
        setUser(payload);
      }

      setLoading(false);
    } catch (err) {
      console.error("Erreur lors du décodage du token:", err);
      logout();
    }
  }, [token, user]);

  const value = {
    token,
    user, // User sans permissions (chargées par les hooks)
    login,
    logout,
    isAuthenticated: !!token,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
