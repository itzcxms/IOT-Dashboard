// src/components/CanAccess.jsx
import { usePermission } from "@/hooks/usePermission";

/**
 * Composant pour afficher conditionnellement du contenu basé sur les permissions
 *
 * @param {Object} props
 * @param {string} props.permission - Permission requise (ex: "users.view")
 * @param {string[]} props.permissions - Tableau de permissions (utilise "any" par défaut)
 * @param {string} props.mode - "any" (au moins une) ou "all" (toutes)
 * @param {React.ReactNode} props.children - Contenu à afficher si autorisé
 * @param {React.ReactNode} props.fallback - Contenu à afficher si non autorisé
 */
export const CanAccess = ({
  permission,
  permissions,
  mode = "any",
  children,
  fallback = null,
}) => {
  const { can, canAll, canAny } = usePermission();

  let hasAccess = false;

  if (permission) {
    // Une seule permission
    hasAccess = can(permission);
  } else if (permissions && Array.isArray(permissions)) {
    // Plusieurs permissions
    hasAccess = mode === "all" ? canAll(permissions) : canAny(permissions);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

// Exemples d'utilisation :
//
// 1. Une seule permission
// <CanAccess permission="users.delete">
//   <button>Supprimer</button>
// </CanAccess>
//
// 2. Au moins une des permissions
// <CanAccess permissions={["users.view", "users.update"]} mode="any">
//   <div>Contenu visible</div>
// </CanAccess>
//
// 3. Toutes les permissions requises
// <CanAccess permissions={["users.view", "users.delete"]} mode="all">
//   <button>Action admin</button>
// </CanAccess>
//
// 4. Avec fallback
// <CanAccess permission="users.delete" fallback={<p>Accès refusé</p>}>
//   <button>Supprimer</button>
// </CanAccess>
