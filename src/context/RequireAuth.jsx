// src/context/RequireAuth.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function RequireAuth() {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  // Attendre le chargement
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  // Pas de token / pas d'utilisateur => rediriger vers connexion
  if (!token || !user) {
    return <Navigate to="/connexion" replace state={{ from: location }} />;
  }

  // Vérifier si l'utilisateur est actif
  if (user.actif === false) {
    return <Navigate to="/compte-inactif" replace />;
  }

  // OK => laisser passer les routes enfants
  return <Outlet />;
}
