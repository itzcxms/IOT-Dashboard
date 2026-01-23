// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { usePermission } from "@/hooks/usePermission";
import { ROUTE_PERMISSIONS } from "@/utils/permission";

const ProtectedRoute = ({ children, route }) => {
  const { can, isSuperAdmin, loading } = usePermission();

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
  const requiredPermission = ROUTE_PERMISSIONS[route];

  // Si pas de permission requise, autoriser l'accès
  if (!requiredPermission) {
    return children;
  }
  // Si super admin, autoriser l'accès
  if (isSuperAdmin()) {
    return children;
  }

  // Vérifier la permission spécifique
  if (!can(requiredPermission)) {
    return <Navigate to="/acces-refuse" replace />;
  }

  return children;
};

export default ProtectedRoute;
