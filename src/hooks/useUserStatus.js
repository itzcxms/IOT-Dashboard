// src/hooks/useUserStatus.js
import { useAuth } from "@/context/useAuth";

/**
 * Hook pour vérifier le statut de l'utilisateur
 * @returns {Object} Informations sur le statut de l'utilisateur
 */
export const useUserStatus = () => {
  const { user } = useAuth();

  /**
   * Vérifie si l'utilisateur est actif
   * @returns {boolean}
   */
  const isActive = () => {
    return user?.actif !== false;
  };

  /**
   * Vérifie si l'utilisateur est inactif
   * @returns {boolean}
   */
  const isInactive = () => {
    return user?.actif === false;
  };

  /**
   * Récupère le statut de l'utilisateur
   * @returns {'active' | 'inactive' | 'unknown'}
   */
  const getStatus = () => {
    if (!user) return "unknown";
    return user.actif === false ? "inactive" : "active";
  };

  return {
    isActive,
    isInactive,
    getStatus,
    user,
  };
};

// Exemple d'utilisation :
// const { isActive, isInactive } = useUserStatus();
//
// if (isInactive()) {
//   return <p>Votre compte est inactif</p>;
// }
