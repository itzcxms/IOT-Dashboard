// src/hooks/usePermission.js
import { useContext } from "react";
import { PermissionContext } from "@/context/PermissionContext";

export const usePermission = () => {
  const ctx = useContext(PermissionContext);
  if (!ctx) {
    throw new Error("usePermission doit être utilisé dans PermissionProvider");
  }
  return ctx;
};
