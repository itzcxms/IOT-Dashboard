// src/context/PermissionProvider.jsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { PermissionContext } from "./PermissionContext";
import { useAuth } from "@/context/useAuth";
import generateCallsAPI from "@/functions/GestionnaireCallsAPI";

export default function PermissionProvider({ children }) {
  const { token } = useAuth();
  const location = useLocation();

  const [permissions, setPermissions] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Cache "stamp" : on ne recharge que si ça change
  const lastStampRef = useRef({ roleId: null, authzVersion: null });

  // Anti-spam des triggers (navigation/focus/click)
  const lastCheckAtRef = useRef(0);
  const COOLDOWN_MS = 1500;

  useEffect(() => {
    if (!token) return;

    const tick = async () => {
      if (document.visibilityState !== "visible") return;
      // appeler une route légère qui passe par auth, ex: /api/users/me
      await generateCallsAPI(token, "GET", "/api/users/me", null);
    };

    void tick();
    const id = setInterval(tick, 60000); // 60s
    return () => clearInterval(id);
  }, [token]);

  // const hardLogout = useCallback(() => {
  //   logout();
  //   window.location.href = "/connexion";
  // }, [logout]);

  const loadRolePermissions = useCallback(
    async (roleObj) => {
      const roleId = roleObj?._id;
      if (!roleId) {
        setPermissions([]);
        setRole(null);
        return;
      }

      setRole(roleObj);

      const permResponse = await generateCallsAPI(
        token,
        "GET",
        `/api/roles/${roleId}/permissions`,
        null,
      );

      if (Array.isArray(permResponse)) {
        const allPermissions = permResponse.flatMap(([, perms]) =>
          perms.map((perm) => ({
            id: perm._id,
            value: perm.value,
            name: perm.name,
            categorie: perm.categorie,
            active: perm.active,
          })),
        );
        setPermissions(allPermissions);
      } else {
        setPermissions([]);
      }
    },
    [token],
  );

  // Check léger: /api/users/me, puis recharge perms uniquement si nécessaire
  const checkAndSync = useCallback(async () => {
    if (!token) {
      setPermissions([]);
      setRole(null);
      setLoading(false);
      return;
    }

    const now = Date.now();
    if (now - lastCheckAtRef.current < COOLDOWN_MS) return;
    lastCheckAtRef.current = now;

    try {
      setError(null);

      const me = await generateCallsAPI(token, "GET", "/api/users/me", null);
      if (!me) return;

      if (me.actif === false) {
        navigate("/compte-inactif");
        return;
      }

      const roleId = me?.role_id?._id || null;
      const authzVersion =
        typeof me?.authzVersion === "number" ? me.authzVersion : null;

      const last = lastStampRef.current;

      // Si on a déjà un stamp et qu’il n’a pas bougé -> rien à faire
      if (last.roleId && last.authzVersion !== null) {
        if (roleId === last.roleId && authzVersion === last.authzVersion) {
          setLoading(false);
          return;
        }
      }

      // Stamp a changé -> on met à jour le cache
      lastStampRef.current = { roleId, authzVersion };

      // Si vous voulez "sécurité stricte" lors d’un changement de rôle :
      // -> décommentez ces 2 lignes et commentez le loadRolePermissions
      // if (last.roleId && roleId && roleId !== last.roleId) return hardLogout();

      setLoading(true);
      await loadRolePermissions(me.role_id);
    } catch (err) {
      setError(err);
      //hardLogout();
    } finally {
      setLoading(false);
    }
  }, [token, loadRolePermissions, navigate]);

  // Chargement initial
  useEffect(() => {
    void checkAndSync();
  }, [checkAndSync]);

  // Trigger 1: changement de page
  useEffect(() => {
    if (!token) return;
    void checkAndSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Trigger 2: retour onglet/focus
  useEffect(() => {
    if (!token) return;

    const onFocus = () => void checkAndSync();
    const onVisibility = () => {
      if (document.visibilityState === "visible") void checkAndSync();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [token, checkAndSync]);

  // Trigger 3 (optionnel) : click/keydown, mais sans spam grâce au cooldown
  useEffect(() => {
    if (!token) return;

    const handler = () => void checkAndSync();
    window.addEventListener("click", handler, true);
    window.addEventListener("keydown", handler, true);
    return () => {
      window.removeEventListener("click", handler, true);
      window.removeEventListener("keydown", handler, true);
    };
  }, [token, checkAndSync]);

  const isSuperAdmin = useCallback(() => {
    if (!role || typeof role.poids !== "number") return false;
    return role.poids >= 1000;
  }, [role]);

  const can = useCallback(
    (permissionValue) => {
      if (isSuperAdmin()) return true;
      return permissions.some((p) => p.value === permissionValue && p.active);
    },
    [permissions, isSuperAdmin],
  );

  const canAll = useCallback(
    (permissionValues) => {
      if (isSuperAdmin()) return true;
      return permissionValues.every((p) => can(p));
    },
    [can, isSuperAdmin],
  );

  const canAny = useCallback(
    (permissionValues) => {
      if (isSuperAdmin()) return true;
      return permissionValues.some((p) => can(p));
    },
    [can, isSuperAdmin],
  );

  const refresh = useCallback(async () => {
    await checkAndSync();
  }, [checkAndSync]);

  const value = useMemo(
    () => ({
      can,
      canAll,
      canAny,
      isSuperAdmin,
      permissions,
      role,
      loading,
      error,
      refresh,
    }),
    [
      can,
      canAll,
      canAny,
      isSuperAdmin,
      permissions,
      role,
      loading,
      error,
      refresh,
    ],
  );

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}
