// src/hooks/useUserStatus.js
import { useAuth } from "@/context/useAuth";
import { useState, useEffect } from "react";
import generateCallsAPI from "@/functions/GestionnaireCallsAPI";
import { useNavigate } from "react-router-dom";

/**
 * Hook pour vérifier le statut de l'utilisateur
 * Récupère les informations à jour depuis l'API
 * @returns {Object} Informations sur le statut de l'utilisateur
 */
export const useUserStatus = () => {
  const { user, token, logout } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Charger les infos utilisateur depuis l'API
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!token || !user?.id) {
        setUserInfo(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Récupérer les infos utilisateur depuis l'API
        const response = await generateCallsAPI(
          token,
          "GET",
          `/api/users/me`,
          null,
        );

        if (response) {
          setUserInfo(response);

          // Si l'utilisateur est devenu inactif, déconnecter
          if (response.actif === false) {
            console.warn("Utilisateur désactivé côté serveur");
            navigate("/compte-bloquer");
            logout();
          }
        }
      } catch (err) {
        console.error("Erreur lors du chargement du statut utilisateur:", err);
        setError(err);

        // Si erreur 404 ou 401, l'utilisateur n'existe plus ou n'est plus autorisé
        if (err.response?.status === 404 || err.response?.status === 401) {
          logout();
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchUserInfo();
  }, [logout, navigate, token, user.id]);

  /**
   * Vérifie si l'utilisateur est actif
   * @returns {boolean}
   */
  const isActive = () => {
    // Vérifier dans les données de l'API si disponibles
    if (userInfo) {
      return userInfo.actif !== false;
    }
    // Sinon vérifier dans le user du contexte
    return user?.actif !== false;
  };

  /**
   * Vérifie si l'utilisateur est inactif
   * @returns {boolean}
   */
  const isInactive = () => {
    return !isActive();
  };

  /**
   * Récupère le statut de l'utilisateur
   * @returns {'active' | 'inactive' | 'unknown'}
   */
  const getStatus = () => {
    if (!user && !userInfo) return "unknown";

    const userData = userInfo || user;
    return userData.actif === false ? "inactive" : "active";
  };

  /**
   * Recharger les infos utilisateur depuis l'API
   */
  const refresh = async () => {
    if (!token || !user?.id) return;

    try {
      const response = await generateCallsAPI(
        token,
        "GET",
        `/api/users/view/${user.id}`,
        null,
      );

      if (response) {
        setUserInfo(response);

        // Vérifier si désactivé
        if (response.actif === false) {
          navigate("/compte-inactif");
          logout();
        }
      }
    } catch (err) {
      console.error("Erreur lors du rechargement du statut:", err);
    }
  };

  return {
    isActive,
    isInactive,
    getStatus,
    userInfo, // Informations complètes de l'utilisateur
    loading,
    error,
    refresh, // Fonction pour recharger manuellement
  };
};

// Exemple d'utilisation :
// const { isActive, isInactive, userInfo, loading } = useUserStatus();
//
// if (loading) return <p>Chargement...</p>;
//
// if (isInactive()) {
//   return <p>Votre compte est inactif</p>;
// }
//
// console.log("Infos utilisateur:", userInfo);
