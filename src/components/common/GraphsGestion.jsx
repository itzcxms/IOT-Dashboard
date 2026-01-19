import React, { useEffect, useState } from "react";
import Graphs2 from "@/components/common/Graphs2.jsx";
import generateCallsAPI from "@/functions/GestionnaireCallsAPI.jsx";
import { useAuth } from "@/context/useAuth.jsx";
import { NumToMois } from "@/functions/GestionnaireDates.jsx";

function GraphsGestion() {
  const { token } = useAuth();
  const [ChartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSelection, setCurrentSelection] = useState("Aujourd'hui");

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

  if (isLoading) {
    return (
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Chargement...</span>
      </div>
    );
  }

  return (
    <div>
      <Graphs2
        ChartData={ChartData}
        currentSelection={currentSelection}
        getDataGraph={getDataGraph}
      />
    </div>
  );
}

export default GraphsGestion;
