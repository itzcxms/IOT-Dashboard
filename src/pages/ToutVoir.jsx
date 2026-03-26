import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis } from "recharts";
import {
  MapPin,
  Sun,
  Users,
  Droplets,
  Waves,
  ClipboardList,
  ArrowUpRight,
  Cloud,
  Cloudy,
  CloudRain,
  CloudMoonRain,
  CloudSunRain,
  CloudSun,
  Snowflake,
  LoaderCircle,
  MoonStar,
  CloudMoon,
  CloudRainWind,
  Wind,
  SunSnow,
  AlertCircle,
} from "lucide-react";
import {
  aggregateObservationsByIntervalWithMinMax,
  getLatestObservation,
  getObservationsLastHours,
  getObservationsToday,
  getObservationsVigicrues,
} from "@/functions/FonctionsAppelVigicrue.jsx";
import { useAuth } from "@/context/useAuth";
import generateCallsAPI from "@/functions/GestionnaireCallsAPI.jsx";

// Configuration du graphique
const chartConfig = {
  min: {
    label: "Min",
    color: "var(--chart-3)",
  },
  moyenne: {
    label: "Moyenne",
    color: "var(--chart-3)",
  },
  max: {
    label: "Max",
    color: "var(--chart-3)",
  },
};

// Composant StatCard réutilisable
function StatCard({
  icon: Icon,
  title,
  subtitle,
  value,
  unit,
  className = "",
}) {
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <button className="absolute top-3 right-3 p-1 rounded-md hover:bg-black/5 transition-colors">
        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
      </button>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="h-4 w-4" />
          <span className="text-xs">
            {title}{" "}
            <span className="text-muted-foreground/70">({subtitle})</span>
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-semibold tracking-tight">{value}</span>
          <span className="text-lg text-muted-foreground">{unit}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Fonction pour formater la date
function formatDate() {
  const now = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const dateStr = now.toLocaleDateString("fr-FR", options);
  return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
}

function formatTime() {
  const now = new Date();
  return now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Icône météo dynamique
function WeatherIcon({ condition }) {
  if (condition.includes("Snow") && condition !== "SunSnow") {
    condition = "Snow";
  }
  switch (condition) {
    case "Sun":
      return (
        <div className="mt-4 flex items-center gap-3">
          <Sun className="h-8 w-8 text-yellow-500" />
          <span className={"text-sm font-medium"}>Ensoleillé</span>
        </div>
      );
    case "Moon":
      return (
        <div className="mt-4 flex items-center gap-3">
          <MoonStar className="h-8 w-8 text-gray-600" />
          <span className={"text-sm font-medium"}>Nuit dégagée</span>
        </div>
      );
    case "Cloud":
      return (
        <div className="mt-4 flex items-center gap-3">
          <Cloud className="h-8 w-8 text-gray-400" />
          <span className={"text-sm font-medium"}>Nuageux</span>
        </div>
      );
    case "Cloudy":
      return (
        <div className="mt-4 flex items-center gap-3">
          <Cloudy className="h-8 w-8 text-gray-400" />
          <span className={"text-sm font-medium"}>Couvert</span>
        </div>
      );
    case "CloudSun":
      return (
        <div className="mt-4 flex items-center gap-3">
          <CloudSun className="h-8 w-8 text-yellow-300" />
          <span className={"text-sm font-medium"}>Nuageux</span>
        </div>
      );
    case "CloudSunRain":
      return (
        <div className="mt-4 flex items-center gap-3">
          <CloudSunRain className="h-8 w-8 text-gray-300" />
          <span className={"text-sm font-medium"}>
            Nuageux et pluvieux avec éclaircies
          </span>
        </div>
      );
    case "CloudMoon":
      return (
        <div className="mt-4 flex items-center gap-3">
          <CloudMoon className="h-8 w-8 text-gray-600" />
          <span className={"text-sm font-medium"}>Nuageux</span>
        </div>
      );
    case "CloudMoonRain":
      return (
        <div className="mt-4 flex items-center gap-3">
          <CloudMoonRain className="h-8 w-8 text-gray-600" />
          <span className={"text-sm font-medium"}>Nuageux et pluvieux</span>
        </div>
      );
    case "CouldRain":
      return (
        <div className="mt-4 flex items-center gap-3">
          <CloudRain className="h-8 w-8 text-blue-400" />
          <span className={"text-sm font-medium"}>Pluvieux</span>
        </div>
      );
    case "CouldRainWind":
      return (
        <div className="mt-4 flex items-center gap-3">
          <CloudRainWind className="h-8 w-8 text-blue-400" />
          <span className={"text-sm font-medium"}>Venteux et pluvieux</span>
        </div>
      );
    case "Wind":
      return (
        <div className="mt-4 flex items-center gap-3">
          <Wind className="h-8 w-8 text-gray-400" />
          <span className={"text-sm font-medium"}>Venteux</span>
        </div>
      );
    case "Snow":
      return (
        <div className="mt-4 flex items-center gap-3">
          <Snowflake className="h-8 w-8 text-cyan-300" />
          <span className={"text-sm font-medium"}>Neigeux</span>
        </div>
      );
    case "SunSnow":
      return (
        <div className="mt-4 flex items-center gap-3">
          <SunSnow className="h-8 w-8 text-cyan-300" />
          <span className={"text-sm font-medium"}>Neigeux</span>
        </div>
      );
    default:
      return (
        <div className="mt-4 flex items-center gap-3">
          <Sun className="h-8 w-8 text-yellow-500" />
          <span className={"text-sm font-medium"}>Ensoleillé</span>
        </div>
      );
  }
}

function ToutVoir() {
  const { user, token } = useAuth();

  // 🎯 CONSOLIDATION DES STATES - 3 états composites au lieu de 13
  const [isLoading, setIsLoading] = useState(true);

  // État pour données de Vigicrues (eau)
  const [waterData, setWaterData] = useState({
    levelData: null,
    minLevel: null,
    currentHeight: null,
  });

  // État pour données générales (météo, fréquentation, etc.)
  const [dashboardData, setDashboardData] = useState({
    weatherCondition: null,
    temperature: null,
    frequentation: null,
    soap: null,
    questionnaires: null,
  });

  // État pour erreurs
  const [errors, setErrors] = useState({
    vigicrues: null,
    weather: null,
    general: null,
  });

  const CODE_STATION_VIGICRUES = "K447001001";

  /**
   * Traite les données météo - MAINTENANT AVEC useCallback!
   */
  const traitementDataMeteo = useCallback((data) => {
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
    return weatherKeywords.join("");
  }, []);

  const getWaterLevelDataGraph = useCallback(async () => {
    try {
      console.log(new Date().getHours());
      let data;
      if (new Date().getHours() < 12) {
        data = await getObservationsLastHours(CODE_STATION_VIGICRUES, 12, "H");
      } else {
        data = await getObservationsToday(CODE_STATION_VIGICRUES, "H");
      }
      const formattedData = aggregateObservationsByIntervalWithMinMax(
        data,
        "hour",
        1,
      );

      if (formattedData && formattedData.length > 0) {
        const minLevel = Math.min(...formattedData.map((d) => d.min));
        return { levelData: formattedData, minLevel };
      }
      return null;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données Vigicrues:",
        error,
      );
      setErrors((prev) => ({ ...prev, vigicrues: error.message }));
      return null;
    }
  }, []);

  const getDataEauCard = useCallback(async () => {
    try {
      const data = await getObservationsVigicrues(CODE_STATION_VIGICRUES, "H");
      return getLatestObservation(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la hauteur d'eau:",
        error,
      );
      setErrors((prev) => ({ ...prev, vigicrues: error.message }));
      return null;
    }
  }, []);

  const getDataMeteo = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=47.48&longitude=1.18&models=meteofrance_seamless&current=rain,showers,snowfall,precipitation,temperature_2m,apparent_temperature,wind_speed_10m,is_day,cloud_cover&timezone=Europe%2FBerlin",
      );
      if (response.status === 200) {
        const data = await response.json();
        const temperature = data.current.temperature_2m;
        // ✅ Utiliser traitementDataMeteo directement au lieu de passer en dépendance
        const condition = traitementDataMeteo(data.current);
        return { temperature, condition };
      }
      throw new Error("Réponse non-200 de l'API météo");
    } catch (error) {
      console.error("Erreur lors de la récupération de la météo:", error);
      setErrors((prev) => ({ ...prev, weather: error.message }));
      return null;
    }
  }, []); // ✅ Dépendances vides - pas de traitementDataMeteo ici

  const getDataFrequentation = useCallback(async () => {
    try {
      if (!token) throw new Error("Token d'authentification manquant");
      const freq = await generateCallsAPI(
        token,
        "POST",
        "/api/graphs/capteurs/today",
        { type: "toilette" },
      );
      return freq?.total || null;
    } catch (error) {
      console.error("Erreur fréquentation:", error);
      setErrors((prev) => ({ ...prev, general: error.message }));
      return null;
    }
  }, [token]);

  const getDataSavon = useCallback(async () => {
    try {
      if (!token) throw new Error("Token d'authentification manquant");
      const savon = await generateCallsAPI(token, "GET", "/api/savon/");
      if (savon && savon.length > 0) {
        return (
          savon[0].seuils.actuel -
          savon[0].consommationParPassage *
            savon[0].dernierRemplissage.compteurPassages
        );
      }
      return null;
    } catch (error) {
      console.error("Erreur savon:", error);
      setErrors((prev) => ({ ...prev, general: error.message }));
      return null;
    }
  }, [token]);

  const getDataQuestionnaires = useCallback(async () => {
    try {
      if (!token) throw new Error("Token d'authentification manquant");
      const total = await generateCallsAPI(
        token,
        "GET",
        "/api/questionnaires/stats/last7days",
      );
      return total?.total || null;
    } catch (error) {
      console.error("Erreur questionnaires:", error);
      setErrors((prev) => ({ ...prev, general: error.message }));
      return null;
    }
  }, [token]);

  /**
   * UN SEUL useEffect COHÉRENT pour charger les données
   */
  useEffect(() => {
    const fetchAllData = async () => {
      // Vérifier token
      if (!token) {
        setErrors((prev) => ({ ...prev, general: "Non authentifié" }));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrors({ vigicrues: null, weather: null, general: null });

      try {
        // ✅ Utiliser Promise.allSettled au lieu de Promise.all
        // Permet à certains appels de échouer sans tout bloquer
        const results = await Promise.allSettled([
          getWaterLevelDataGraph(),
          getDataEauCard(),
          getDataMeteo(),
          getDataFrequentation(),
          getDataSavon(),
          getDataQuestionnaires(),
        ]);

        const [
          waterGraphResult,
          waterHeightResult,
          meteoResult,
          freqResult,
          soapResult,
          questionsResult,
        ] = results;

        // Traiter les résultats
        const waterGraph =
          waterGraphResult.status === "fulfilled"
            ? waterGraphResult.value
            : null;
        const waterHeight =
          waterHeightResult.status === "fulfilled"
            ? waterHeightResult.value
            : null;
        const meteo =
          meteoResult.status === "fulfilled" ? meteoResult.value : null;
        const freq =
          freqResult.status === "fulfilled" ? freqResult.value : null;
        const soap =
          soapResult.status === "fulfilled" ? soapResult.value : null;
        const questions =
          questionsResult.status === "fulfilled" ? questionsResult.value : null;

        // Mettre à jour Vigicrues
        if (waterGraph || waterHeight) {
          setWaterData({
            levelData: waterGraph?.levelData || null,
            minLevel: waterGraph?.minLevel || null,
            currentHeight: waterHeight || null,
          });
        }

        // Mettre à jour dashboard
        setDashboardData({
          weatherCondition: meteo?.condition || null,
          temperature: meteo?.temperature || null,
          frequentation: freq || null,
          soap: soap || null,
          questionnaires: questions || null,
        });
      } catch (error) {
        console.error("Erreur générale:", error);
        setErrors((prev) => ({ ...prev, general: error.message }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [
    token,
    getWaterLevelDataGraph,
    getDataEauCard,
    getDataMeteo,
    getDataFrequentation,
    getDataSavon,
    getDataQuestionnaires,
  ]);

  // Rendu - avec gestion des erreurs
  const hasErrors = Object.values(errors).some((e) => e !== null);

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] space-y-4">
      {/* Header */}
      {/*<h1 className="text-2xl font-semibold">
        Bonjour, {user?.prenom || "Utilisateur"} {user?.nom || ""}
      </h1>*/}
      {/*Modif pour bébé Cameron*/}
      <h1 className="text-2xl font-semibold">Bonjour, Sacha Touille</h1>

      {/* Alerte d'erreur */}
      {hasErrors && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Erreurs de chargement</p>
            <ul className="text-sm text-red-700 mt-1">
              {errors.vigicrues && <li>• Vigicrues: {errors.vigicrues}</li>}
              {errors.weather && <li>• Météo: {errors.weather}</li>}
              {errors.general && <li>• Général: {errors.general}</li>}
            </ul>
          </div>
        </div>
      )}

      {/* Grille principale */}
      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        {/* Colonne gauche */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          {/* Carte Météo */}
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between pb-0">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Chaumont-sur-Loire</span>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <div>{formatDate()}</div>
                <div>{formatTime()}</div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <span className="text-5xl font-semi-bold">
                  {isLoading ? (
                    <div className="mt-4 flex items-center gap-3">
                      <LoaderCircle className="h-8 w-8 text-gray-500 animate-spin" />
                      <span className={"text-sm font-medium"}>
                        Chargement...
                      </span>
                    </div>
                  ) : dashboardData.temperature !== null ? (
                    dashboardData.temperature + "°C"
                  ) : (
                    "N/A"
                  )}
                </span>
              </div>

              {/* Météo */}
              {isLoading ? (
                <div className="mt-4 flex items-center gap-3">
                  <LoaderCircle className="h-8 w-8 text-gray-500 animate-spin" />
                  <span className={"text-sm font-medium"}>Chargement...</span>
                </div>
              ) : dashboardData.weatherCondition ? (
                <WeatherIcon condition={dashboardData.weatherCondition} />
              ) : (
                <div className="mt-4 text-sm text-muted-foreground">
                  Données non disponibles
                </div>
              )}
            </CardContent>
          </Card>

          {/* Grille de statistiques */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon={Users}
              title="Fréquentation"
              subtitle="du jour"
              value={
                isLoading ? (
                  <LoaderCircle className="h-6 w-6 text-gray-500 animate-spin" />
                ) : dashboardData.frequentation !== null ? (
                  dashboardData.frequentation
                ) : (
                  "N/A"
                )
              }
              unit={isLoading ? "" : "personnes"}
            />
            <StatCard
              icon={Droplets}
              title="Contenance estimée"
              subtitle="du savon"
              value={
                isLoading ? (
                  <LoaderCircle className="h-6 w-6 text-gray-500 animate-spin" />
                ) : dashboardData.soap !== null ? (
                  Math.round(dashboardData.soap)
                ) : (
                  "N/A"
                )
              }
              unit={isLoading ? "" : "mL"}
            />
            <StatCard
              icon={Waves}
              title="Hauteur"
              subtitle="du jour"
              value={
                isLoading ? (
                  <LoaderCircle className="h-6 w-6 text-gray-500 animate-spin" />
                ) : waterData.currentHeight !== null ? (
                  waterData.currentHeight.toFixed(2).replace(".", ",")
                ) : (
                  "N/A"
                )
              }
              unit={isLoading ? "" : "m"}
            />
            <StatCard
              icon={ClipboardList}
              title="Questionnaires remplis"
              subtitle="semaine"
              value={
                isLoading ? (
                  <LoaderCircle className="h-6 w-6 text-gray-500 animate-spin" />
                ) : dashboardData.questionnaires !== null ? (
                  dashboardData.questionnaires
                ) : (
                  "N/A"
                )
              }
              unit={isLoading ? "" : "fois"}
            />
          </div>
        </div>

        {/* Colonne droite */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-4 h-full">
          {/* Graphique évolution niveau d'eau */}
          <Card className="relative flex-[1.5] flex flex-col min-h-0">
            <button className="absolute top-3 right-3 p-1 rounded-md hover:bg-black/5 transition-colors">
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Évolution du niveau de l'eau
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 pb-4">
              {isLoading ? (
                <div className="mt-4 flex items-center justify-center w-[100%] h-[100%] gap-3">
                  <LoaderCircle className="h-16 w-16 text-gray-500 animate-spin" />
                  <span className={"text-2xl font-medium"}>Chargement...</span>
                </div>
              ) : waterData.levelData ? (
                <ChartContainer
                  config={chartConfig}
                  className="h-full w-full aspect-auto"
                >
                  <AreaChart data={waterData.levelData}>
                    <defs>
                      <linearGradient
                        id="minMaxGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--chart-3)"
                          stopOpacity={0.15}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--chart-3)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="heure"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    />
                    <YAxis
                      hide
                      domain={[
                        waterData.minLevel - 0.1,
                        (dataMax) => dataMax + 0.1,
                      ]}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      cursor={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="max"
                      stroke="var(--chart-3)"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      fill="url(#minMaxGradient)"
                      isAnimationActive={false}
                      dot={false}
                      opacity={0.5}
                    />
                    <Area
                      type="monotone"
                      dataKey="moyenne"
                      stroke="var(--chart-3)"
                      strokeWidth={3}
                      fill="none"
                      isAnimationActive={false}
                      dot={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="min"
                      stroke="var(--chart-3)"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      fill="none"
                      isAnimationActive={false}
                      dot={false}
                      opacity={0.5}
                    />
                  </AreaChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">
                    Données non disponibles
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ToutVoir;
