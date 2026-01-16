// src/context/RequireAuth.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function RequireAuth() {
  const { user, token } = useAuth(); // adapte selon ton contexte
  const location = useLocation();

  // Pas de token / pas d'utilisateur => on bloque
  if (!token || !user) {
    return <Navigate to="/connexion" replace state={{ from: location }} />;
  }

  // OK => on laisse passer les routes enfants
  return <Outlet />;
}
