import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { useAuth } from "@/context/useAuth.jsx";
import generateCallsAPI from "@/functions/GestionnaireCallsAPI.jsx";
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
  const nomCategorie = {
    users: "Utilisateures",
    roles: "Rôles",
    permissions: "Permissions",
    admin: "Administrateur",
    Seuils: "Seuils",
  };

  /**
   * Récupère la liste de tous les rôles disponibles depuis l'API
   * @memberof module:Permissions
   * @inner
   * @async
   * @function getRoles
   * @returns {Promise<Object[]>} Promesse qui résout vers un tableau des rôles
   * @throws {Error} Erreur si la requête API échoue
   */

  async function getRoles() {
    return generateCallsAPI(token, "GET", "/api/roles/all");
  }

  /**
   * Récupère les droits associés à un rôle spécifique
   * @memberof module:Permissions
   * @inner
   * @async
   * @function getDroits
   * @param {string} role - L'identifiant du rôle pour lequel récupérer les droits
   * @returns {Promise<Object[]>} Promesse qui résout vers les droits du rôle
   * @throws {Error} Erreur si la requête API échoue
   */
  async function getDroits(role) {
    return generateCallsAPI(
      token,
      "GET",
      "/api/roles/" + role + "/permissions",
    );
  }

  /**
   * Met à jour l'état d'un droit spécifique pour un rôle donné
   * Effectue la mise à jour en base de données et met à jour l'état local
   * @memberof module:Permissions
   * @inner
   * @async
   * @function updateDroit
   * @param {string} idDroit - L'identifiant du droit à modifier
   * @param {string} idRole - L'identifiant du rôle concerné
   * @param {boolean} active - Le nouvel état actif/inactif du droit
   * @param {Object} paramsSup - Paramètres supplémentaires pour la mise à jour locale
   * @param {number} paramsSup.categorie - Index de la catégorie dans le tableau des droits
   * @param {number} paramsSup.key - Index du droit dans la catégorie
   * @returns {Promise<void>}
   * @throws {Error} Erreur si la requête API échoue
   */
  async function updateDroit(idDroit, idRole, active, paramsSup) {
    // POST : Update droit pour le role en BDD
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

  /**
   * Met à jour le rôle actuellement sélectionné
   * Recherche le rôle par son ID dans la liste des rôles disponibles
   * @memberof module:Permissions
   * @inner
   * @async
   * @function updateRole
   * @param {string} idRole - L'identifiant du rôle à sélectionner
   * @returns {Promise<void>}
   */
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
    /**
     * Fonction interne pour récupérer et initialiser les données
     * Charge les rôles, sélectionne le premier rôle par défaut et récupère ses droits
     * @memberof module:Permissions
     * @inner
     * @async
     * @function fetchData
     * @returns {Promise<void>}
     */
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

  if (isLoading) {
    return <div>Chargement...</div>;
  }

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
    <div>
      <h2>Roles</h2>
      <div className="flex justify-around">
        {roles !== null
          ? roles.map((role, key) => (
              <Card
                key={key}
                className={
                  currentRole.name === role.name ? "bg-cyan-900 w-fit" : "w-fit"
                }
                onClick={() => {
                  if (currentRole._id !== role._id) {
                    updateRole(role._id);
                  }
                }}
              >
                <div className={"w-fit"}>
                  <CardContent className={"capitalize w-fit"}>
                    {role.name}
                  </CardContent>
                </div>
              </Card>
            ))
          : "Chargement..."}
      </div>
      <h2>Droits</h2>
      <div className={"flex flex-col gap-4"}>
        {droits !== null
          ? droits.map((droitData, key) => {
              return (
                <div
                  key={key}
                  className={
                    "border border-slate-800 p-2 rounded-md bg-slate-600 backdrop-blur"
                  }
                >
                  <h2 className={"pb-4"}>{droitData[0]}</h2>
                  <div className="grid grid-cols-4 gap-4">
                    {droitData[1].map((droit, key2) => {
                      return (
                        <Card key={droit._id}>
                          <CardHeader data-brute={JSON.stringify(droit)}>
                            <div className={"flex justify-between"}>
                              <CardTitle>{droit.name}</CardTitle>
                              <input
                                type={"checkbox"}
                                onChange={() =>
                                  updateDroit(
                                    droit._id,
                                    currentRole._id,
                                    !droit.active,
                                    { categorie: key, key: key2 },
                                  )
                                }
                                checked={droit.active}
                              ></input>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p style={{ color: "#bbbbee" }}>
                              {droit.description.length > 0
                                ? droit.description
                                    .toString()
                                    .charAt(0)
                                    .toUpperCase() +
                                  droit.description.toString().slice(1)
                                : "Description à implémenter"}
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })
          : "Chargement..."}
      </div>
    </div>
  );
}

export default Permissions;
