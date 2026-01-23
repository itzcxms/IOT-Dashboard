"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DropDownTempGraph from "@/components/common/DropDownTempGraph.jsx";
import DropDown2Selector from "@/components/common/DropDown2Selector.jsx";
import GraphContainer from "@/components/common/GraphContainer.jsx";
import ReloadGraph from "@/components/common/ReloadGraph.jsx";

/**
 * @fileoverview Composant de gestion et d'affichage de graphiques dynamiques
 * @module Graphs
 * @since 1.0.0
 */

/**
 * Displays and manages graphs based on specified data and configurations.
 *
 * @param {Object} options - The options object.
 * @param {string} options.typeCapteur - The type of sensor for which the graph is generated.
 * @param {number|null} [options.line=null] - Additional optional line parameter for specific graph configurations.
 * @returns {JSX.Element} A rendered graph component with dynamic data and configurations.
 */
function Graphs({
  isLoadingData,
  ChartData,
  currentSelection,
  getDataGraph,
  line = null,
}) {
  const [trends, setTrends] = useState(null);
  const [chartConfig, setChartConfig] = useState(null);
  const [params, setParams] = useState(null);
  const [yAxisConfigs, setYAxisConfigs] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Calcule le pourcentage de la dernière augmentation ou diminution de la valeur de tocheck
   * et détermine le trend à afficher (up ou down)
   *
   * @inner
   * @inner
   * @function getTrendAndPercentage
   * @param {string} tocheck - Paramètre à vérifier pour calculer la tendance
   * @returns {{trend: string, percentage: string}} Objet contenant la tendance et le pourcentage
   */
  function getTrendAndPercentage(tocheck) {
    let len = ChartData.length - 1;
    while (
      ChartData[len].tocheck === ChartData[len - 1].tocheck &&
      ChartData[len - 1].tocheck === 0
    ) {
      len -= 1;
    }
    const percentage = (
      (ChartData[len].tocheck / ChartData[len - 1].tocheck) * 100 -
      100
    ).toFixed(2);
    const trend = percentage > 0 ? "up" : "down";
    return { trend: trend, percentage: percentage };
  }

  /**
   * Récupère la valeur la plus grande de la liste des valeurs fournies
   *
   *
   * @inner
   * @function getBiggestUnit
   * @param {number} value - Valeur pour laquelle déterminer l'unité la plus grande
   * @returns {number} La plus grande unité appropriée
   */
  function getBiggestUnit(value) {
    if (value === 0) return 1;

    const absValue = Math.abs(value);
    let unit = 1;

    // Trouver la plus grande puissance de 10
    while (unit * 10 <= absValue) {
      unit *= 10;
    }

    return unit;
  }

  /**
   * Génère la configuration de l'axe Y pour le graphique pour le paramètre fourni
   *
   *
   * @inner
   * @function generateYAxisConfig
   * @param {string} param - Paramètre pour lequel générer la configuration de l'axe Y
   * @returns {{domain: number[], ticks: number[], unit: number}} Configuration de l'axe Y
   */
  function generateYAxisConfig(param) {
    let max = ChartData[0][param];
    let min = ChartData[0][param];

    // Trouver min et max
    for (let i = 0; i < ChartData.length; i++) {
      if (ChartData[i][param] < min) {
        min = ChartData[i][param];
      }
      if (ChartData[i][param] > max) {
        max = ChartData[i][param];
      }
    }

    // Déterminer la plus grande unité basée sur la valeur maximale
    const biggestUnit = getBiggestUnit(max);

    // Arrondir min et max aux multiples de la plus grande unité
    let roundedMin = Math.floor(min / biggestUnit) * biggestUnit;
    let roundedMax = Math.ceil(max / biggestUnit) * biggestUnit;

    roundedMin = roundedMin > 0 ? 0 : roundedMin;
    roundedMax =
      roundedMax % biggestUnit === 0 ? roundedMax + biggestUnit : roundedMax;

    // Générer les ticks (valeurs sur l'axe Y)
    const ticks = [];
    for (let i = roundedMin; i <= roundedMax; i += biggestUnit) {
      ticks.push(i);
    }

    return {
      domain: [roundedMin, roundedMax],
      ticks: ticks,
      unit: biggestUnit,
    };
  }

  /**
   * Génère la configuration du graphique
   *
   * @function generateConfig
   * @returns {{config: Object, param: {XAxis: string, datas: string[], amountOf: number}}} Configuration du graphique et paramètres
   */
  function generateConfig() {
    let keys = [];
    keys = Object.keys(ChartData[0]);
    let config = {};
    let param = {
      XAxis: keys[0],
      datas: [],
      amountOf: ChartData.length,
    };

    for (let i = 1; i < keys.length; i++) {
      let contentConfig = {};
      const label = keys[i];
      contentConfig["label"] = label.charAt(0).toUpperCase() + label.slice(1);
      contentConfig["color"] = `var(--color-multi-chart-${i + 1})`;
      config[label] = contentConfig;
      param.datas.push(label);
    }

    return { config, param };
  }

  /**
   * Appelle la récupération des trends et pourcentages pour tous les axes fournis
   *
   *
   * @inner
   * @function generateAxisTrend
   * @param {string[]} paramList - Liste des paramètres pour lesquels générer les tendances
   * @returns {Object} Objet contenant les tendances pour chaque paramètre
   */
  function generateAxisTrend(paramList) {
    let dataTrends = {};

    for (let i = 0; i < paramList.length; i++) {
      dataTrends[paramList[i]] = getTrendAndPercentage(paramList[i]);
    }

    return dataTrends;
  }

  /**
   * Génère la configuration de tous les axes verticaux pour le graphique
   *
   *
   * @inner
   * @function generateAllYAxisConfigs
   * @param {string[]} paramList - Liste des paramètres pour lesquels générer les configurations d'axes Y
   * @returns {Object} Configurations des axes Y pour tous les paramètres
   */
  function generateAllYAxisConfigs(paramList) {
    let configs = {};

    for (let i = 0; i < paramList.length; i++) {
      configs[paramList[i]] = generateYAxisConfig(paramList[i]);
    }

    return configs;
  }

  useEffect(() => {
    /**
     * Récupère et génère l'ensemble des données nécessaires pour le graphique
     *
     * @async
     * @function fetchData
     * @returns {Promise<void>}
     */
    async function fetchData() {
      await setIsLoading(true);
      let trendsData = trends;
      if (ChartData !== null && ChartData.length !== 0) {
        const { config, param } = generateConfig();
        if (ChartData.length > 1) {
          trendsData = generateAxisTrend(param.datas);
        }
        const yConfigs = generateAllYAxisConfigs(param.datas);

        await setChartConfig(config);
        await setParams(param);
        await setTrends(trendsData);
        await setYAxisConfigs(yConfigs);
        await setIsLoading(false);
      }
    }
    void fetchData();
  }, [ChartData]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!ChartData || !ChartData[0] || Object.keys(ChartData[0]).length < 1) {
    return <div>No data</div>;
  }

  return (
    <Card className="Card">
      <CardHeader>
        <CardTitle className={"flex flex-row-reverse gap-2"}>
          <DropDownTempGraph
            nomSelection={
              typeof currentSelection === "object"
                ? currentSelection[0]
                : currentSelection
            }
            data={["Aujourd'hui", "Mois", "Année"]}
            getDataGraph={getDataGraph}
          />
          <div>
            {typeof currentSelection === "object" ? (
              <ReloadGraph
                nom={currentSelection[0]}
                data={currentSelection.slice(1)}
                getDataGraph={getDataGraph}
              />
            ) : (
              <ReloadGraph
                nom={currentSelection}
                data={currentSelection.slice(1)}
                getDataGraph={getDataGraph}
              />
            )}
          </div>
        </CardTitle>
        <CardDescription className={"flex flex-row-reverse"}>
          <div>
            {typeof currentSelection === "object" ? (
              <DropDown2Selector
                nom={currentSelection[0]}
                data={currentSelection.slice(1)}
                getDataGraph={getDataGraph}
              />
            ) : (
              ""
            )}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GraphContainer
          ChartData={ChartData}
          chartConfig={chartConfig}
          params={params}
          currentSelection={currentSelection}
          yAxisConfigs={yAxisConfigs}
          line={line}
          isLoadingData={isLoadingData}
          isLoadingParams={isLoading}
        />
      </CardContent>
    </Card>
  );
}

export default Graphs;
