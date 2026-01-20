// src/hooks/usePermission.js
import { useAuth } from "@/context/useAuth";
import { hasPermission } from "@/utils/permission";

/**
 * Hook pour vérifier facilement les permissions dans les composants
 * @returns {Object} Fonctions de vérification de permissions
 */
export const usePermission = () => {
  const { user } = useAuth();

  /**
   * Vérifie si l'utilisateur a une permission spécifique
   * @param {string} permissionValue - La valeur de la permission (ex: "users.view")
   * @returns {boolean}
   */
  const can = (permissionValue) => {
    return hasPermission(user, permissionValue);
  };

  /**
   * Vérifie si l'utilisateur a toutes les permissions spécifiées
   * @param {string[]} permissionValues - Tableau de valeurs de permissions
   * @returns {boolean}
   */
  const canAll = (permissionValues) => {
    return permissionValues.every((perm) => hasPermission(user, perm));
  };

  /**
   * Vérifie si l'utilisateur a au moins une des permissions spécifiées
   * @param {string[]} permissionValues - Tableau de valeurs de permissions
   * @returns {boolean}
   */
  const canAny = (permissionValues) => {
    return permissionValues.some((perm) => hasPermission(user, perm));
  };

  return {
    can,
    canAll,
    canAny,
  };
};

// Exemple d'utilisation dans un composant :
// const { can } = usePermission();
// if (can('users.delete')) {
//   // Afficher le bouton de suppression
// }
