// src/utils/permissions.js

export const ROUTE_PERMISSIONS = {
  // Pages accessibles à tous les utilisateurs authentifiés
  "/dashboard": null,
  "/gestion-de-l-aire": null,
  "/savon": null,
  "/zone-inondable": null,
  "/analyse-satisfaction": null,

  // Pages nécessitant des permissions spécifiques
  "/admin/liste-utilisateurs": "users.view",
  "/admin/permissions": "permissions.view",

  // Pages compte toujours accessibles
  "/compte": null,
  "/compte/details": null,
};

/**
 * Vérifie si un utilisateur est super administrateur
 * Basé sur le poids du rôle (poids le plus élevé = super admin)
 * @param {Object} user - L'utilisateur
 * @returns {boolean}
 */
export const isSuperAdmin = (user) => {
  if (!user || !user.role) return false;

  const role = typeof user.role === "object" ? user.role : null;

  if (!role || !role.poids) return false;

  return role.poids === 1000;
};

/**
 * Vérifie si un utilisateur a une permission spécifique
 * @param {Object} user - L'utilisateur (contient role_id et ses permissions)
 * @param {string} permissionValue - La valeur de la permission (ex: "users.view")
 * @returns {boolean}
 */
export const hasPermission = (user, permissionValue) => {
  if (!user) return false;

  // Super Admin bypass toutes les permissions
  if (isSuperAdmin(user)) return true;

  if (!user.permissions) return false;

  // user.permissions doit être un tableau de permissions actives
  return user.permissions.some(
    (perm) => perm.value === permissionValue && perm.active,
  );
};

/**
 * Vérifie si un utilisateur peut accéder à une route
 * @param {Object} user - L'utilisateur
 * @param {string} route - La route (ex: "/dashboard")
 * @returns {boolean}
 */
export const canAccessRoute = (user, route) => {
  if (!user) return false;

  // Super Admin bypass toutes les restrictions
  if (isSuperAdmin(user)) return true;

  const requiredPermission = ROUTE_PERMISSIONS[route];

  // Si aucune permission n'est requise, autoriser l'accès
  if (!requiredPermission) return true;

  return hasPermission(user, requiredPermission);
};
