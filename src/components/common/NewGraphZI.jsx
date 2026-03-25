import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DropDownTempGraph from "@/components/common/DropDownTempGraph.jsx";
import GraphContainer from "@/components/common/GraphContainer.jsx";
import ReloadGraph from "@/components/common/ReloadGraph.jsx";
import {
  getObservationsVigicrues,
  aggregateObservationsByInterval,
  formatObservationsForChart,
  getLatestObservation,
  filterObservationsByDate,
  filterObservations,
} from "@/functions/FonctionsAppelVigicrue.jsx";

/**
 * Composant de graphique spécialisé pour la zone inondable utilisant les données Vigicrues
 * @param {Object} props - Les propriétés du composant
 * @param {number} props.seuilDanger - Seuil de danger pour afficher une ligne de référence
 * @returns {JSX.Element} Composant de graphique pour la zone inondable
 */
function NewGraphZI({ seuilDanger }) {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSelection, setCurrentSelection] = useState("1 jour");
  const [rawData, setRawData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [trends, setTrends] = useState(null);
  const [chartConfig, setChartConfig] = useState({
    haut: {
      label: "Niveau d'eau (m)",
      color: "var(--chart-1)",
    },
  });

  // Configuration des options de période
  const periodOptions = {
    "Par jour": "1p",
    "7 jours": "7p",
    "30 jours": "30p",
    "60 jours": "60p",
    "90 jours": "90p",
  };

  /**
   * Récupère et traite les données Vigicrues pour une période donnée
   * @param {string} period - La période sélectionnée
   */
  async function getDataGraph(period) {
    try {
      setIsLoading(true);
      let processedData = [];
      let needsUpdate = false;

      // Vérifier si on a besoin de récupérer de nouvelles données
      if (
        !rawData ||
        !lastUpdate ||
        Date.now() - lastUpdate > 30 * 60 * 1000 // 30 minutes
      ) {
        needsUpdate = true;
      }

      let currentRawData = rawData;
      if (needsUpdate) {
        // Récupérer les données depuis Vigicrues (station K447001001 pour la zone inondable)
        currentRawData = await getObservationsVigicrues("K447001001", "H");
        setRawData(currentRawData);
        setLastUpdate(Date.now());
      }

      // Traiter les données selon la période demandée
      switch (periodOptions[period]) {
        case "1j":
          // Données des dernières 24h, agrégées par heure
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          const now = new Date();
          let oneDayData = filterObservations(currentRawData, oneDayAgo, now);
          processedData = aggregateObservationsByInterval(
            oneDayData,
            "hour",
            1,
            "average",
          );
          break;

        case "7j":
          // Données des 7 derniers jours, agrégées par 6 heures
          let sevenDaysData = filterObservationsByDate(currentRawData, 7);
          processedData = aggregateObservationsByInterval(
            sevenDaysData,
            "hour",
            6,
            "average",
          );
          break;

        case "30j":
          // Données des 30 derniers jours, agrégées par jour
          let thirtyDaysData = filterObservationsByDate(currentRawData, 30);
          processedData = aggregateObservationsByInterval(
            thirtyDaysData,
            "day",
            1,
            "average",
          );
          break;

        case "60j":
          // Données des 60 derniers jours, agrégées par 2 jours
          let sixtyDaysData = filterObservationsByDate(currentRawData, 60);
          processedData = aggregateObservationsByInterval(
            sixtyDaysData,
            "day",
            2,
            "average",
          );
          break;

        case "90j":
          // Données des 90 derniers jours, agrégées par 3 jours
          let ninetyDaysData = filterObservationsByDate(currentRawData, 90);
          processedData = aggregateObservationsByInterval(
            ninetyDaysData,
            "day",
            3,
            "average",
          );
          break;

        default:
          processedData = formatObservationsForChart(currentRawData);
      }

      // Calculer les tendances
      if (processedData.length > 1) {
        const latest = processedData[processedData.length - 1];
        const previous = processedData[processedData.length - 2];
        const change = ((latest.haut - previous.haut) / previous.haut) * 100;

        setTrends({
          haut: {
            trend: change > 0 ? "up" : "down",
            percentage: Math.abs(change).toFixed(2),
          },
        });
      }

      setChartData(processedData);
      setCurrentSelection(period);
    } catch (error) {
      console.error("Erreur lors du chargement des données Vigicrues:", error);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Recharge les données en forçant une mise à jour
   */
  async function reloadData() {
    setRawData(null);
    setLastUpdate(null);
    await getDataGraph(currentSelection);
  }

  // Chargement initial
  useEffect(() => {
    if (!chartData) {
      getDataGraph("1 jour");
    }
  }, []);

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Zone Inondable - Niveau d'eau</CardTitle>
          <CardDescription>
            Évolution du niveau d'eau de la Loire - Station Vigicrues K447001001
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <DropDownTempGraph
            nomSelection={currentSelection}
            data={periodOptions}
            getDataGraph={getDataGraph}
          />
          <ReloadGraph onReload={reloadData} />
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <GraphContainer
          chartData={chartData}
          chartConfig={chartConfig}
          isLoading={isLoading}
          trends={trends}
          referenceLine={seuilDanger}
          yAxisLabel="Niveau (m)"
          xAxisKey="heure"
          dataKeys={["haut"]}
        />
      </CardContent>
    </Card>
  );
}

export default NewGraphZI;
