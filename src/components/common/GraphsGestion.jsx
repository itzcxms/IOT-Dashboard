import React, { useEffect, useState } from "react";
import generateCallsAPI from "@/functions/GestionnaireCallsAPI.jsx";
import { useAuth } from "@/context/useAuth.jsx";
import { NumToMois } from "@/functions/GestionnaireDates.jsx";
import Graphs from "@/components/common/Graphs.jsx";

function GraphsGestion() {
  const { token } = useAuth();
  const [ChartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSelection, setCurrentSelection] = useState("Aujourd'hui");
  const temperature = [
    10, 12, 13, 14, 16, 18, 19, 20, 21, 22, 23, 24, 25, 27, 27, 28, 28, 26, 20,
    16, 13, 10, 8, 7,
  ];
  const vent = [
    10, 10, 11, 11, 11, 12, 12, 8, 8, 7, 6, 8, 9, 9, 11, 14, 16, 20, 25, 26, 27,
    27, 27, 26,
  ];

  /**
   * Appelle les routes d'API
   *
   * @memberof module:Graphs
   * @inner
   * @async
   * @function getDataAPI
   * @param {string} type - Type de requête (GET|POST|PUT|DELETE)
   * @param {string} route - Route de l'API
   * @param {Object|null} [data=null] - Données à envoyer avec la requête
   * @returns {Promise<any>} Réponse de l'API
   */
  async function getDataAPI(type, route, data = null) {
    if (data === null) {
      return generateCallsAPI(token, type, route);
    }
    return generateCallsAPI(token, type, route, data);
  }

  /**
   * Récupère les informations pour les graphiques
   *
   * @memberof module:Graphs
   * @inner
   * @async
   * @function getDataGraph
   * @param {string} key - Période de données (Aujourd'hui|Mois|Année)
   * @param {number|null} [annee=null] - Année spécifique (optionnel)
   * @param {number|null} [mois=null] - Mois spécifique (optionnel)
   * @returns {Promise<void>}
   */
  async function getDataGraph(key, annee = null, mois = null) {
    await setIsLoading(true);
    let tempDatas = null;
    const date = new Date();
    if (key === "Année") {
      if (annee === null) {
        annee = date.getFullYear();
      }
      tempDatas = await getDataAPI("POST", "/api/graphs/capteurs/year", {
        type: "toilette",
        annee: parseInt(annee),
      });
      tempDatas = tempDatas.donnees;
      if (Object.keys(tempDatas).length === 1) {
        let dataSup = await getDataAPI("POST", "/api/graphs/capteurs/year", {
          type: "toilette",
          annee: parseInt(annee) - 1,
        });
        dataSup = dataSup.donnees;
        dataSup = dataSup[dataSup.length - 1];
        dataSup = [dataSup];
        tempDatas = dataSup.concat(tempDatas);
      }
      await setCurrentSelection([key, annee]);
    } else if (key === "Mois") {
      if (annee === null) {
        annee = date.getFullYear();
      }
      if (mois === null) {
        mois = date.getMonth() + 1;
      }
      tempDatas = await getDataAPI("POST", "/api/graphs/capteurs/month", {
        type: "toilette",
        annee: annee,
        start: NumToMois(mois),
        end: NumToMois(mois),
      });
      tempDatas = tempDatas.donnees;
      await setCurrentSelection([key, annee, mois]);
    } else {
      tempDatas = await getDataAPI("POST", "/api/graphs/capteurs/today", {
        type: "toilette",
      });
      tempDatas = tempDatas.donnees;
      for (let i = 0; i < tempDatas.length; i++) {
        tempDatas[i].vent = vent[i];
        tempDatas[i].temperature = temperature[i];
      }
      await setCurrentSelection(key);
    }
    await setChartData(tempDatas);
    await setIsLoading(false);
  }

  useEffect(() => {
    async function fetchData() {
      if (ChartData === null) {
        await getDataGraph("Aujourd'hui");
      }
    }
    void fetchData();
  });

  return (
    <div>
      <Graphs
        isLoadingData={isLoading}
        ChartData={ChartData}
        currentSelection={currentSelection}
        getDataGraph={getDataGraph}
      />
    </div>
  );
}

export default GraphsGestion;
