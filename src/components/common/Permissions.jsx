import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { useAuth } from "@/context/useAuth.jsx";
import generateCallsAPI from "@/functions/GestionnaireCallsAPI.jsx";

function Permissions() {
  const { token } = useAuth();
  const [roles, setRoles] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [droits, setDroits] = useState(null);
  const nomCategorie = {
    users: "Utilisateures",
    roles: "Rôles",
    permissions: "Permissions",
    admin: "Administrateur",
    Seuils: "Seuils",
  };
  // const [infos, setInfos] = useState([]);

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

  async function updateRole(idRole) {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i]._id === idRole) {
        await setCurrentRole(roles[i]);
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
          ? droits.map((droitData, key) => (
              <div
                key={key}
                className={
                  "border border-slate-800 p-2 rounded-md bg-slate-600 backdrop-blur"
                }
              >
                <h2 className={"pb-4"}>{nomCategorie[droitData[0]]}</h2>
                <div className="grid grid-cols-4 gap-4">
                  {droitData[1].map((droit, key2) => {
                    return (
                      <Card key={droit._id}>
                        <CardHeader data-brute={JSON.stringify(droit)}>
                          <div className={"flex justify-between"}>
                            <CardTitle>{droit.name.split(" - ")[1]}</CardTitle>
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
                          <p className={"capitalize"}>
                            {droit.description.length > 0
                              ? droit.description
                              : "Description à implémenter"}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))
          : "Chargement..."}
      </div>
    </div>
  );
}

export default Permissions;
