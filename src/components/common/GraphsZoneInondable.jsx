import React, { useEffect, useState, useCallback } from "react";
import Graphs from "@/components/common/Graphs.jsx";
import {
  aggregateObservationsByInterval,
  filterObservations,
  filterObservationsLastDays,
  getObservationsVigicrues,
} from "@/functions/FonctionsAppelVigicrue.jsx";

function GraphsZoneInondable({ seuilDanger, vigicrueData = null }) {
  const [ChartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [completeData, setCompleteData] = useState(vigicrueData || null);
  const [recievedTimeData, setRecievedTimeData] = useState(null); // Datetime
  const [hasError, setHasError] = useState(false);

  /**
   * Valide si les données Vigicrues sont complètes et valides
   */
  const isDataValid = (data) => {
    return data?.Serie?.ObssHydro && Array.isArray(data.Serie.ObssHydro) && data.Serie.ObssHydro.length > 0;
  };

  /**
   * Fonction utilitaire pour sauvegarder des données en JSON
   */
  const saveDataToJSON = (data, filename) => {
    /*try {
      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log(`📁 Données sauvegardées dans ${filename}`);
    } catch (error) {
      console.error(`❌ Erreur lors de la sauvegarde de ${filename}:`, error);
    }*/
  };

  /**
   * Récupère les informations pour les graphiques
   *
   * @memberof module:Graphs
   * @inner
   * @async
   * @function getDataGraph
   * @param {string} key - Période de données (Aujourd'hui|Mois|Année)
   * @param {number|null} [date=null] - Date spécifique (optionnel)
   * @returns {Promise<void>}
   */
  const getDataGraph = useCallback(async (key, date = null) => {
    try {
      console.log(key);
      setIsLoading(true);
      setHasError(false);

      let recieveDate = false;
      let tempDatas = null;
      let dateGiven = true;
      let tempCompleteDatas = completeData;

      if (date === null) {
        date = new Date();
        dateGiven = false;
      }

      // Vérifier si mise à jour des données est nécessaire
      let updateData = false;
      if (
        dateGiven &&
        key === "1p" &&
        recievedTimeData &&
        recievedTimeData.getTime() < date.getTime() - 1000 * 60 * 60
      ) {
        updateData = true;
      }

      // Récupérer les données si nécessaire
      if (!isDataValid(tempCompleteDatas) || updateData) {
        tempCompleteDatas = await getObservationsVigicrues("K447001001", "H");
        recieveDate = true;
        
        // Valider que les données récupérées sont correctes
        if (!isDataValid(tempCompleteDatas)) {
          throw new Error("Les données Vigicrues récupérées sont invalides");
        }
      }

      // Traiter les données selon la période demandée
      if (key === "1p") {
        let dateDebut = new Date(new Date().setHours(0, 0, 0, 0));
        let dateFin = new Date();
        tempDatas = filterObservations(tempCompleteDatas, dateDebut, dateFin);
        tempDatas = aggregateObservationsByInterval(
          tempDatas,
          "hour",
          1,
          "average",
        );
        setCurrentSelection(["vigicrue", key, date]);
      } else if (key === "7p") {
        tempDatas = filterObservationsLastDays(tempCompleteDatas, 7);
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        saveDataToJSON(
          tempDatas,
          `donnees-avant-agregation-7p-${timestamp}.json`,
        );
        tempDatas = aggregateObservationsByInterval(
          tempDatas,
          "day",
          1,
          "average",
        );
        saveDataToJSON(
          tempDatas,
          `donnees-apres-agregation-7p-${timestamp}.json`,
        );
        setCurrentSelection(["vigicrue", key]);
      } else if (key === "30p") {
        tempDatas = filterObservationsLastDays(tempCompleteDatas, 30);
        tempDatas = aggregateObservationsByInterval(
          tempDatas,
          "day",
          1,
          "average",
        );
        setCurrentSelection(["vigicrue", key]);
      } else if (key === "60p") {
        tempDatas = filterObservationsLastDays(tempCompleteDatas, 60);
        tempDatas = aggregateObservationsByInterval(
          tempDatas,
          "day",
          2,
          "average",
        );
        setCurrentSelection(["vigicrue", key]);
      } else if (key === "90p") {
        tempDatas = filterObservationsLastDays(tempCompleteDatas, 90);
        tempDatas = aggregateObservationsByInterval(
          tempDatas,
          "day",
          5,
          "average",
        );
        setCurrentSelection(["vigicrue", key]);
      }

      // Mettre à jour l'état avec les nouvelles données
      setCompleteData(tempCompleteDatas);
      if (recieveDate) {
        setRecievedTimeData(new Date());
      }
      console.log(tempDatas);
      setChartData(tempDatas);
    } catch (error) {
      console.error("Erreur dans getDataGraph:", error);
      setHasError(true);
      setChartData(null);
    } finally {
      setIsLoading(false);
    }
  }, [completeData, recievedTimeData]);

  // Effet pour initialiser les données depuis les props
  useEffect(() => {
    if (isDataValid(vigicrueData) && !isDataValid(completeData)) {
      setCompleteData(vigicrueData);
      setRecievedTimeData(new Date());
    }
  }, [vigicrueData]); // Dépendance sur vigicrueData uniquement

  // Effet pour charger le premier graphique une fois que completeData est disponible
  useEffect(() => {
    if (isDataValid(completeData) && ChartData === null && currentSelection === null) {
      getDataGraph("1p");
    }
  }, [completeData, ChartData, currentSelection, getDataGraph]);

  return (
    <div>
      <Graphs
        isLoadingData={isLoading}
        ChartData={ChartData}
        currentSelection={currentSelection}
        getDataGraph={getDataGraph}
        line={seuilDanger}
      />
    </div>
  );
}

export default GraphsZoneInondable;
