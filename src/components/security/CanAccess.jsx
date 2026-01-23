import React from "react";
import { usePermission } from "@/hooks/usePermission";

export function CanAccess({
  permission,
  permissions,
  mode = "any",
  children,
  fallback = null,
  loadingFallback = null,
}) {
  const { can, canAll, canAny, loading } = usePermission();

  if (loading) return <>{loadingFallback}</>;

  let hasAccess = false;

  if (permission) {
    hasAccess = can(permission);
  } else if (Array.isArray(permissions)) {
    hasAccess = mode === "all" ? canAll(permissions) : canAny(permissions);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
