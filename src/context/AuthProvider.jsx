// src/context/AuthProvider.jsx
import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import generateCallsAPI from "../functions/GestionnaireCallsAPI";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  });

  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les permissions de l'utilisateur depuis l'API
  useEffect(() => {
    const loadUserPermissions = async () => {
      if (!token || !user?.role) {
        setPermissions([]);
        setLoading(false);
        return;
      }

      try {
        // Récupérer les permissions du rôle depuis l'API
        const response = await generateCallsAPI(
          token,
          "GET",
          `/roles/${user.role._id || user.role}/permissions`,
          null,
        );

        if (response && Array.isArray(response)) {
          // Aplatir les catégories et extraire les permissions
          const allPermissions = response.flatMap(([perms]) =>
            perms.map((perm) => ({
              id: perm._id,
              value: perm.value,
              name: perm.name,
              categorie: perm.categorie,
              active: perm.active, // Vient de RolePermission.actif
            })),
          );

          setPermissions(allPermissions);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des permissions:", error);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    void loadUserPermissions();
  }, [token, user, user?.role]);

  // Gestion du token et de l'utilisateur
  useEffect(() => {
    if (token && user) {
      localStorage.setItem("token", token.toString());
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token, user]);

  // Vérification de l'expiration du token et du statut actif
  useEffect(() => {
    if (!token) return;

    try {
      const payload = jwtDecode(token);

      // Vérifier l'expiration du token
      if (payload.exp && payload.exp * 1000 < Date.now()) {
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
    setPermissions([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = {
    token,
    user: user ? { ...user, permissions } : null,
    login,
    logout,
    isAuthenticated: !!token,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
