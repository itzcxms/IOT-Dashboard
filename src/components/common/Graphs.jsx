"use client";

import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { NumToMois } from "@/functions/GestionnaireDates.jsx";
import DropDownTempGraph from "@/components/common/DropDownTempGraph.jsx";
import DropDown2Selector from "@/components/common/DropDown2Selector.jsx";
import generateCallsAPI from "@/functions/GestionnaireCallsAPI.jsx";
import { useAuth } from "@/context/useAuth.jsx";

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
function Graphs({ typeCapteur, line = null }) {
  const { token } = useAuth();
  const [ChartData, setChartData] = useState(null);
  const [trends, setTrends] = useState(null);
  const [chartConfig, setChartConfig] = useState(null);
  const [params, setParams] = useState(null);
  const [yAxisConfigs, setYAxisConfigs] = useState(null);
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
    const date = new Date();
    if (key === "Année") {
      if (annee === null) {
        annee = date.getFullYear();
      }
      tempDatas = await getDataAPI("POST", "/api/graphs/capteurs/year", {
        type: typeCapteur,
        annee: parseInt(annee),
      });
      tempDatas = tempDatas.donnees;
      if (Object.keys(tempDatas).length === 1) {
        let dataSup = await getDataAPI("POST", "/api/graphs/capteurs/year", {
          type: typeCapteur,
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
        type: typeCapteur,
        annee: annee,
        start: NumToMois(mois),
        end: NumToMois(mois),
      });
      tempDatas = tempDatas.donnees;
      await setCurrentSelection([key, annee, mois]);
    } else {
      tempDatas = await getDataAPI("POST", "/api/graphs/capteurs/today", {
        type: typeCapteur,
      });
      tempDatas = tempDatas.donnees;
      await setCurrentSelection(key);
    }
    await setChartData(tempDatas);
    await setIsLoading(true);
  }

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
    let keys;
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
      contentConfig["color"] = `var(--chart-${i + 1})`;
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
      let trendsData = trends;
      if (ChartData === null) {
        await getDataGraph("Aujourd'hui");
      }
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

  const texte = params.datas[0];
  const resultat = texte.charAt(0).toUpperCase() + texte.slice(1);

  return (
    <Card className="Card">
      <CardHeader>
        <CardTitle className={"flex justify-between"}>
          <div>
            {resultat} {params.datas.length > 1 ? "et " + params.datas[1] : ""}{" "}
            {" au cours des " +
              params.amountOf +
              " derniers " +
              params.XAxis +
              (params.amountOf > 1 &&
              params.XAxis.substring(params.XAxis.length - 1) !== "s"
                ? "s"
                : "")}
          </div>
          <DropDownTempGraph
            nomSelection={
              typeof currentSelection === "object"
                ? currentSelection[0]
                : currentSelection
            }
            data={["Aujourd'hui", "Mois", "Année"]}
            getDataGraph={getDataGraph}
          />
        </CardTitle>
        <CardDescription className={"flex justify-end"}>
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
        <ChartContainer config={chartConfig} className="GraphContainer">
          <AreaChart
            accessibilityLayer
            data={ChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={params.XAxis}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                currentSelection[0] === "Année"
                  ? NumToMois(value).slice(0, 3)
                  : value.slice(0, 3)
              }
            />
            {params.datas.map((param, index) => {
              const axisConfig = yAxisConfigs[param];
              return (
                <YAxis
                  key={param}
                  yAxisId={param}
                  domain={axisConfig.domain}
                  allowDecimals={true}
                  ticks={axisConfig.ticks}
                  tickLine={true}
                  axisLine={true}
                  tickMargin={10}
                  orientation={index % 2 === 1 ? "right" : "left"}
                  label={{
                    value: chartConfig[param].label,
                    angle: -90,
                    position: "insideLeft",
                    offset: 20,
                    style: { textAnchor: "middle" },
                  }}
                />
              );
            })}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            {params.datas.map((param) => {
              if (
                yAxisConfigs[param].domain[0] >= 0 &&
                params.datas.length === 1
              ) {
                return (
                  <Area
                    key={param}
                    dataKey={param}
                    yAxisId={param}
                    type="linear"
                    fill={`var(--color-${param})`}
                    fillOpacity={0.4}
                    stroke={`var(--color-${param})`}
                  />
                );
              } else {
                return (
                  <Area
                    key={param}
                    dataKey={param}
                    yAxisId={param}
                    type="linear"
                    fillOpacity={0}
                    stroke={`var(--color-${param})`}
                  />
                );
              }
            })}
            {line !== null ? (
              <ReferenceLine
                yAxisId={params.datas[0]}
                y={line}
                stroke="red"
                strokeDasharray="5 0"
              />
            ) : (
              ""
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {/*<CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            {params.datas.map((param, key) => {
              if (
                trends[param].trend === "up" &&
                chartConfig[param] !== undefined
              ) {
                return (
                  <div
                    key={key}
                    className="flex items-center gap-2 leading-none font-medium"
                  >
                    {chartConfig[param].label} : Trending up by{" "}
                    {trends[param].percentage}%{" "}
                    <TrendingUp className="h-4 w-4" />
                  </div>
                );
              } else if (chartConfig[param] !== undefined) {
                return (
                  <div
                    key={key}
                    className="flex items-center gap-2 leading-none font-medium"
                  >
                    {chartConfig[param].label} : Trending down by{" "}
                    {trends[param].percentage * -1}%{" "}
                    <TrendingUp
                      className="h-4 w-4"
                      style={{ transform: "scaleY(-1)" }}
                    />
                  </div>
                );
              }
            })}
          </div>
        </div>
      </CardFooter>*/}
    </Card>
  );
}

export default Graphs;
