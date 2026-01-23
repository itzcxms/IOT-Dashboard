import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { useAuth } from "@/context/useAuth.jsx";
import generateCallsAPI from "@/functions/GestionnaireCallsAPI.jsx";
import { Alert, AlertDescription } from "@/components/ui/alert.jsx";
import {
  Shield,
  UserCircle,
  PenLine,
  Key,
  Settings,
  AlertTriangle,
  Check,
  Gauge
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert.jsx";
import { Button } from "@/components/ui/button.jsx";
import { X } from "lucide-react";

/**
 * @fileoverview Composant de gestion des permissions et rôles utilisateur
 * @module Permissions
 * @since 1.0.0
 */

/**
 * Composant principal pour la gestion des permissions
 * Affiche les rôles disponibles et permet de gérer les droits associés
 * @returns {React.JSX.Element} Le composant de gestion des permissions
 */
function Permissions() {
  const { token } = useAuth();
  const [roles, setRoles] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inError, setInError] = useState(false);
  const [droits, setDroits] = useState(null);

  // Mapping des catégories avec icônes et noms
  const categoriesConfig = {
    users: { name: "Utilisateurs", icon: UserCircle, color: "text-blue-500" },
    roles: { name: "Rôles", icon: Shield, color: "text-purple-500" },
    permissions: { name: "Permissions", icon: Key, color: "text-amber-500" },
    admin: { name: "Administration", icon: Settings, color: "text-red-500" },
    Seuils: { name: "Seuils", icon: Gauge, color: "text-green-500" },
  };

  // Fonction pour obtenir la config d'une catégorie
  const getCategoryConfig = (categoryKey) => {
    return categoriesConfig[categoryKey] || {
      name: categoryKey,
      icon: Settings,
      color: "text-muted-foreground"
    };
  };

  // Fonction pour obtenir l'icône selon le nom du rôle
  const getRoleIcon = (roleName) => {
    const name = roleName?.toLowerCase();
    if (name?.includes('utilisateur') || name?.includes('user')) return UserCircle;
    if (name?.includes('editeur') || name?.includes('editor') || name?.includes('éditeur')) return PenLine;
    return Shield; // admin ou autre
  };

  async function getRoles() {
    return generateCallsAPI(token, "GET", "/api/roles/all");
  }

  async function getDroits(role) {
    return generateCallsAPI(
      token,
      "GET",
      "/api/roles/" + role + "/permissions",
    );
  }

  async function updateDroit(idDroit, idRole, active, paramsSup) {
    void (await generateCallsAPI(
      token,
      "POST",
      "/api/roles/" + idRole + "/permissions/" + idDroit,
      {
        actif: active,
      },
    ));

    let tempDroits = [...droits];
    tempDroits[paramsSup.categorie][1][paramsSup.key].active = active;
    await setDroits(tempDroits);
  }

  async function updateRole(idRole) {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i]._id === idRole) {
        let tempDroits = await getDroits(roles[i]._id);
        await setCurrentRole(roles[i]);
        await setDroits(tempDroits);
      }
    }
  }

  useEffect(() => {
    async function fetchData() {
      let tempRoles = roles;
      let tempDroits = droits;
      let tempCurrentRole = currentRole;
      if (tempRoles === null) {
        tempRoles = await getRoles();
      }
      if (
        currentRole === null &&
        (tempRoles !== null || roles !== null) &&
        tempDroits === null
      ) {
        const futurRole = tempRoles !== null ? tempRoles[0] : roles[0];
        tempCurrentRole = futurRole;
        tempDroits = await getDroits(futurRole._id);
      } else if (currentRole !== null && tempDroits === null) {
        tempDroits = await getDroits(currentRole._id);
      }
      if (
        tempRoles === null ||
        tempDroits === null ||
        Object.keys(tempRoles).find((e) => e === "message") ||
        Object.keys(tempDroits).find((e) => e === "message")
      ) {
        setInError(true);
      } else {
        setInError(false);
      }
      await setRoles(tempRoles);
      await setCurrentRole(tempCurrentRole);
      await setDroits(tempDroits);
      await setIsLoading(false);
    }
    void fetchData();
  }, [currentRole]);

  // Composant de chargement
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-32 rounded-lg" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Composant d'erreur
  if (inError) {
    let message = {};
    if (Object.keys(roles).find((e) => e === "message")) {
      message = roles.message;
    } else {
      message = droits.message;
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestion des permissions</h2>
          <p className="text-muted-foreground">
            Gérez les rôles et droits d'accès des utilisateurs
          </p>
        </div>
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription className="ml-2">
            <div className="font-medium">{message}</div>
            <div className="text-sm opacity-80 mt-1">
              Notre équipe technique a été informée. Essayez de recharger la page dans quelques instants.
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Calculer les stats pour le rôle actuel
  const totalPermissions = droits?.reduce((acc, cat) => acc + cat[1].length, 0) || 0;
  const activePermissions = droits?.reduce((acc, cat) =>
    acc + cat[1].filter(d => d.active).length, 0) || 0;

  if (inError) {
    let message = {};
    if (Object.keys(roles).find((e) => e === "message")) {
      message = roles.message;
    } else {
      message = droits.message;
    }

    return (
      <div>
        <Alert variant="destructive">
          <AlertDescription className="flex items-start justify-between flex-col w-full">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs font-bold">
                !
              </div>
              <div>
                <div>{message}</div>
                <div>Notre équipe technique à été informée de cette erreur</div>
                <div>Essayez de recharger dans page dans quelques instants</div>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gestion des permissions</h2>
        <p className="text-muted-foreground">
          Gérez les rôles et droits d'accès des utilisateurs
        </p>
      </div>

      {/* Sélection du rôle */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Rôles disponibles</CardTitle>
          </div>
          <CardDescription>
            Sélectionnez un rôle pour gérer ses permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {roles !== null &&
              roles.map((role, key) => (
                <button
                  key={key}
                  onClick={() => {
                    if (currentRole._id !== role._id) {
                      updateRole(role._id);
                    }
                  }}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all duration-200
                    flex items-center gap-2 capitalize
                    ${currentRole?.name === role.name
                      ? "bg-primary text-primary-foreground shadow-md scale-105"
                      : "bg-muted hover:bg-muted/80 text-foreground hover:scale-102"
                    }
                  `}
                >
                  {(() => {
                    const IconComponent = getRoleIcon(role.name);
                    return <IconComponent className="h-4 w-4" />;
                  })()}
                  {role.name}
                </button>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats du rôle actuel */}
      {currentRole && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rôle sélectionné</p>
                  <p className="text-2xl font-bold capitalize">{currentRole.name}</p>
                </div>
                <Shield className="h-10 w-10 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Permissions actives</p>
                  <p className="text-2xl font-bold">{activePermissions} / {totalPermissions}</p>
                </div>
                <Check className="h-10 w-10 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Catégories</p>
                  <p className="text-2xl font-bold">{droits?.length || 0}</p>
                </div>
                <Key className="h-10 w-10 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Liste des permissions par catégorie */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Permissions</h3>
        </div>

        {droits !== null &&
          droits.map((droitData, categoryIndex) => {
            const categoryKey = droitData[0];
            const permissions = droitData[1];
            const config = getCategoryConfig(categoryKey);
            const IconComponent = config.icon;
            const activeCount = permissions.filter(p => p.active).length;

            return (
              <Card key={categoryIndex} className="overflow-hidden">
                <CardHeader className="p-4 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-muted ${config.color}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{config.name}</CardTitle>
                        <CardDescription>
                          {activeCount} / {permissions.length} permissions actives
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={activeCount === permissions.length ? "default" : "secondary"}>
                      {activeCount === permissions.length ? "Complet" : `${activeCount}/${permissions.length}`}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {permissions.map((droit, permIndex) => (
                      <div
                        key={droit._id}
                        className={`
                          p-3 rounded-lg border transition-all duration-200
                          ${droit.active 
                            ? "bg-primary/5 border-primary/30 hover:border-primary/50" 
                            : "bg-muted/30 border-border hover:border-muted-foreground/30"
                          }
                        `}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {droit.active && (
                                <Check className="h-4 w-4 text-green-500 shrink-0" />
                              )}
                              <span className="font-medium text-sm truncate">
                                {droit.name}
                              </span>
                            </div>
                            <p className={`text-xs text-muted-foreground line-clamp-2 ${droit.active ? 'ml-6' : ''}`}>
                              {droit.description?.length > 0
                                ? droit.description.charAt(0).toUpperCase() +
                                  droit.description.slice(1)
                                : "Aucune description disponible"}
                            </p>
                          </div>
                          <Checkbox
                            checked={droit.active}
                            onCheckedChange={() =>
                              updateDroit(
                                droit._id,
                                currentRole._id,
                                !droit.active,
                                { categorie: categoryIndex, key: permIndex }
                              )
                            }
                            className="mt-0.5"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}

export default Permissions;
