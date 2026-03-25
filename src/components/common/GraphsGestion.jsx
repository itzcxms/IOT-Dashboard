import React, { useEffect, useState, useCallback } from "react";
import generateCallsAPI from "@/functions/GestionnaireCallsAPI.jsx";
import { useAuth } from "@/context/useAuth.jsx";
import { NumToMois } from "@/functions/GestionnaireDates.jsx";
import Graphs from "@/components/common/Graphs.jsx";

function GraphsGestion() {
  const { token } = useAuth();
  const [ChartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSelection, setCurrentSelection] = useState("Aujourd'hui");
  const [weatherData, setWeatherData] = useState(null);
  const [weatherFetchedAt, setWeatherFetchedAt] = useState(null);

  /**
   * Traite les données météo brutes de l'API open-meteo
   */
  const traitementDataMeteo = useCallback(async (data) => {
    let weatherKeywords = [];
    if (data.cloud_cover > 0) {
      if (data.cloud_cover <= 20) {
        weatherKeywords.push("Cloud");
        weatherKeywords.push(data.is_day === 1 ? "Sun" : "Moon");
      } else if (data.cloud_cover >= 90) {
        weatherKeywords.push("Cloudy");
      } else {
        weatherKeywords.push("Cloud");
      }
    } else {
      weatherKeywords.push(data.is_day === 1 ? "Sun" : "Moon");
    }
    if (data.rain > 0 || data.showers > 0) {
      weatherKeywords.push("Rain");
    } else if (data.snowfall > 0) {
      weatherKeywords.push("Snow");
    }
    if (data.wind_speed_10m >= 20 && data.snowfall < 0) {
      weatherKeywords.push("Wind");
    }
    return {
      condition: weatherKeywords.join(""),
      temperature: data.temperature_2m,
      wind: Math.round(data.wind_speed_10m),
    };
  }, []);

  /**
   * Récupère les données météo en temps réel depuis open-meteo
   * Cache les données pendant 10 minutes
   */
  const getDataMeteo = useCallback(async () => {
    try {
      const now = Date.now();
      // Réutiliser la météo si elle a moins de 10 minutes
      if (weatherData && weatherFetchedAt && (now - weatherFetchedAt) < 600000) {
        return weatherData;
      }

      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=47.48&longitude=1.18&models=meteofrance_seamless&current=rain,showers,snowfall,precipitation,temperature_2m,apparent_temperature,wind_speed_10m,is_day,cloud_cover&timezone=Europe%2FBerlin",
      );
      if (response.status === 200) {
        const jsonData = await response.json();
        const meteoData = await traitementDataMeteo(jsonData.current);
        setWeatherData(meteoData);
        setWeatherFetchedAt(now);
        return meteoData;
      }
      console.warn("API open-meteo retourna un status non-200:", response.status);
      return null;
    } catch (error) {
      console.error("Erreur lors de la récupération de la météo:", error);
      return null;
    }
  }, [weatherData, weatherFetchedAt, traitementDataMeteo]);

  /**
   * Appelle les routes d'API
   */
  const getDataAPI = useCallback(
    (type, route, data = null) => {
      if (data === null) {
        return generateCallsAPI(token, type, route);
      }
      return generateCallsAPI(token, type, route, data);
    },
    [token],
  );

  /**
   * Récupère les informations pour les graphiques avec données météo
   */
  const getDataGraph = useCallback(
    async (key, annee = null, mois = null) => {
      try {
        setIsLoading(true);
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
          tempDatas = tempDatas?.donnees || null;
          
          // Validation
          if (!tempDatas || tempDatas.length === 0) {
            console.warn("Aucune donnée reçue pour l'année:", annee);
            setChartData(null);
            setIsLoading(false);
            return;
          }

          if (Object.keys(tempDatas).length === 1) {
            let dataSup = await getDataAPI("POST", "/api/graphs/capteurs/year", {
              type: "toilette",
              annee: parseInt(annee) - 1,
            });
            dataSup = dataSup?.donnees || null;
            if (dataSup && dataSup.length > 0) {
              dataSup = dataSup[dataSup.length - 1];
              dataSup = [dataSup];
              tempDatas = dataSup.concat(tempDatas);
            }
          }
          setCurrentSelection([key, annee]);
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
          tempDatas = tempDatas?.donnees || null;
          
          // Validation
          if (!tempDatas || tempDatas.length === 0) {
            console.warn("Aucune donnée reçue pour le mois:", mois, "année:", annee);
            setChartData(null);
            setIsLoading(false);
            return;
          }

          setCurrentSelection([key, annee, mois]);
        } else {
          // Aujourd'hui - ajouter les données météo en temps réel
          tempDatas = await getDataAPI("POST", "/api/graphs/capteurs/today", {
            type: "toilette",
          });
          tempDatas = tempDatas?.donnees || null;

          // Validation
          if (!tempDatas || tempDatas.length === 0) {
            console.warn("Aucune donnée reçue pour aujourd'hui");
            setChartData(null);
            setIsLoading(false);
            return;
          }

          // Récupérer la météo actuelle
          const meteo = await getDataMeteo();

          // Ajouter les données météo à chaque heure
          if (meteo) {
            for (let i = 0; i < tempDatas.length; i++) {
              tempDatas[i].temperature = meteo.temperature;
              tempDatas[i].vent = meteo.wind;
            }
          } else {
            console.warn("Pas de données météo disponibles, graphique sans météo");
          }

          setCurrentSelection(key);
        }

        setChartData(tempDatas);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setChartData(null);
      } finally {
        setIsLoading(false);
      }
    },
    [getDataAPI, getDataMeteo],
  );

  useEffect(() => {
    if (ChartData === null) {
      getDataGraph("Aujourd'hui");
    }
  }, [ChartData, getDataGraph]);

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
