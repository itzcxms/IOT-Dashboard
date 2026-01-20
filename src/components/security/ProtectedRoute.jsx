// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth.jsx";
import { canAccessRoute } from "@/utils/permission.js";

const ProtectedRoute = ({ children, route }) => {
  const { user, loading } = useAuth();

  // Attendre que les permissions soient chargées
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

  // Vérifier si l'utilisateur peut accéder à cette route
  if (!canAccessRoute(user, route)) {
    // Rediriger vers une page d'accès refusé
    return <Navigate to="/acces-refuse" replace />;
  }

  return children;
};

export default ProtectedRoute;
