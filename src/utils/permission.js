// src/utils/permissions.js

// Mapper les routes aux permissions requises (doit correspondre aux valeurs dans votre DB)
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
