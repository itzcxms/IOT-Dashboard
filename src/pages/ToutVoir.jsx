import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
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
} from "lucide-react";
import { useAuth } from "@/context/useAuth";
import generateCallsAPI from "@/functions/GestionnaireCallsAPI.jsx";

// Données simulées pour les remarques
const remarques = [
  {
    text: "Aire de repos très propre et bien entretenue, merci !",
    positive: true,
  },
  {
    text: "Super expérience sur la Loire à Vélo ! Les paysages sont magnifiques.",
    positive: true,
  },
  { text: "Excellent itinéraire, je recommande vivement.", positive: true },
  { text: "Excellent itinéraire, je recommande vivement.", positive: true },
];

// Configuration du graphique
const chartConfig = {
  haut: {
    label: "Niveau d'eau",
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
  // Capitaliser la première lettre
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
  const [isLoading, setIsLoading] = useState(true);
  const [waterLevelData, setWaterLevelData] = useState(null);
  const [dataMin, setDataMin] = useState(null);
  const [weatherCondition, setWeatherCondition] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [frequentation, setFrequentation] = useState(null);
  const [contenueSavon, setContenueSavon] = useState(null);
  const [hauteurEau, setHauteurEau] = useState(null);
  const [questionnaires, setQuestionnaires] = useState(null);

  async function traitementDataMeteo(data) {
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
  }

  async function getWaterLevelDataGraph() {
    let reponse = await generateCallsAPI(
      token,
      "POST",
      "/api/graphs/capteurs/today",
      { type: "sonde" },
    );
    const dataLen = Object.keys(reponse).length;
    if (dataLen > 0) {
      let min = parseInt(reponse.donnees[0].haut);
      for (let i = 1; i < reponse.donnees.length; i++) {
        if (parseInt(reponse.donnees[i].haut) < min) {
          min = parseInt(reponse.donnees[i].haut);
        }
      }
      return { waterGraph: reponse.donnees, min: min };
    }
  }

  async function getDataEauCard() {
    let hauteurEauCard = await generateCallsAPI(
      token,
      "POST",
      "/api/graphs/capteurs/lastinfo",
      { type: "sonde" },
    );
    return parseInt(hauteurEauCard.haut);
  }

  async function getDataMeteo() {
    let meteo = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=47.48&longitude=1.18&models=meteofrance_seamless&current=rain,showers,snowfall,precipitation,temperature_2m,apparent_temperature,wind_speed_10m,is_day,cloud_cover&timezone=Europe%2FBerlin",
    );
    if (meteo.status === 200) {
      meteo = await meteo.text();
      meteo = JSON.parse(meteo);
      const temperatureTemp = meteo.current.temperature_2m;
      meteo = await traitementDataMeteo(meteo.current);
      return { meteo: meteo, tempe: temperatureTemp };
    }
  }

  async function getDataFrequentation() {
    let freq = await generateCallsAPI(
      token,
      "POST",
      "/api/graphs/capteurs/today",
      { type: "toilette" },
    );
    return freq.total;
  }

  async function getDataSavon() {
    let savon = await generateCallsAPI(token, "GET", "/api/savon/");
    console.log(savon);
    if (savon.length > 0) {
      savon =
        savon[0].seuils.actuel -
        savon[0].consommationParPassage *
          savon[0].dernierRemplissage.compteurPassages;
      return savon;
    }
    return null;
  }

  async function getDataTotalQuestionnaireLast7Days() {
    let total = await generateCallsAPI(
      token,
      "GET",
      "/api/questionnaires/stats/last7days",
    );
    return total.total;
  }

  useEffect(() => {
    async function fetchData() {
      // Niveau de l'eau (Graphique)
      let waterGraph = null;
      let min = null;
      if (waterLevelData === null && dataMin === null) {
        let dataGraph = await getWaterLevelDataGraph();
        waterGraph = dataGraph.waterGraph;
        min = dataGraph.min;
      }
      // Hauteur de l'eau (Card)
      let hautEau = null;
      if (hauteurEau === null) {
        hautEau = await getDataEauCard();
      }
      // Météo
      let meteo = null;
      let tempe = null;
      if (weatherCondition === null && temperature === null) {
        let dataMeteo = await getDataMeteo();
        meteo = dataMeteo.meteo;
        tempe = dataMeteo.tempe;
      }
      // Fréquentation
      let freq = null;
      if (frequentation === null) {
        freq = await getDataFrequentation();
      }
      // Savon
      let savon = null;
      if (contenueSavon === null) {
        savon = await getDataSavon();
      }
      // Questionnaires
      let questRes = null;
      if (questionnaires === null) {
        questRes = await getDataTotalQuestionnaireLast7Days();
      }

      if (waterGraph !== null && min !== null) {
        setWaterLevelData(waterGraph);
        setDataMin(min);
      }
      if (hautEau !== null) {
        setHauteurEau(hautEau);
      }
      if (meteo !== null && tempe !== null) {
        setWeatherCondition(meteo);
        setTemperature(tempe);
      }
      if (freq !== null) {
        setFrequentation(freq);
      }
      if (savon !== null) {
        setContenueSavon(savon);
      }
      if (questRes !== null) {
        setQuestionnaires(questRes);
      }
      if (
        waterLevelData !== null &&
        dataMin !== null &&
        weatherCondition !== null &&
        temperature !== null &&
        frequentation !== null &&
        contenueSavon !== null &&
        hauteurEau !== null &&
        questionnaires !== null
      ) {
        setIsLoading(false);
      }
    }
    if (isLoading) {
      void fetchData();
    }
  });

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] space-y-4">
      {/* Header avec nom utilisateur */}
      <h1 className="text-2xl font-semibold">
        Bonjour, {user?.prenom || "Utilisateur"} {user?.nom || ""}
      </h1>

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
                      <LoaderCircle className="h-8 w-8 text-gray-500" />
                      <span className={"text-sm font-medium"}>
                        Chargement en cours...
                      </span>
                    </div>
                  ) : (
                    temperature + "°C"
                  )}
                </span>
              </div>

              {/* Météo */}
              {isLoading ? (
                <div className="mt-4 flex items-center gap-3">
                  <LoaderCircle className="h-8 w-8 text-gray-500" />
                  <span className={"text-sm font-medium"}>
                    Chargement en cours...
                  </span>
                </div>
              ) : (
                <WeatherIcon condition={weatherCondition} />
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
                  <div className="mt-4 flex items-center gap-3">
                    <LoaderCircle className="h-8 w-8 text-gray-500" />
                    <span className={"text-sm font-medium"}>
                      Chargement en cours...
                    </span>
                  </div>
                ) : (
                  frequentation
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
                  <div className="mt-4 flex items-center gap-3">
                    <LoaderCircle className="h-8 w-8 text-gray-500" />
                    <span className={"text-sm font-medium"}>
                      Chargement en cours...
                    </span>
                  </div>
                ) : (
                  contenueSavon
                )
              }
              unit={isLoading ? "" : "mL"}
            />
            <StatCard
              icon={Waves}
              title="Hauteur"
              subtitle="du jour"
              value={
                isLoading || hauteurEau === null ? (
                  <div className="mt-4 flex items-center gap-3">
                    <LoaderCircle className="h-8 w-8 text-gray-500" />
                    <span className={"text-sm font-medium"}>
                      Chargement en cours...
                    </span>
                  </div>
                ) : (
                  hauteurEau.toFixed(2).replace(".", ",")
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
                  <div className="mt-4 flex items-center gap-3">
                    <LoaderCircle className="h-8 w-8 text-gray-500" />
                    <span className={"text-sm font-medium"}>
                      Chargement en cours...
                    </span>
                  </div>
                ) : (
                  questionnaires
                )
              }
              unit={isLoading ? "" : "fois"}
            />
          </div>
        </div>

        {/* Colonne droite */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-4 h-full">
          {/* Ligne du haut - 2 petites cartes */}
          {/* <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon={ClipboardList}
              title="Questionnaires remplis"
              subtitle="semaine"
              value={frequentation}
              unit="personnes"
            />
            <StatCard
              icon={Waves}
              title="Hauteur"
              subtitle="du jour"
              value={hauteurEau.toFixed(2).replace(".", ",")}
              unit="m"
            />
          </div> */}

          {/* Remarques et suggestions */}
          {/*<Card className="relative flex-1 flex flex-col min-h-0">
            <button className="absolute top-3 right-3 p-1 rounded-md hover:bg-black/5 transition-colors">
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Remarques et suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <ul className="space-y-2">
                {remarques.map((remarque, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span
                      className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${
                        remarque.positive ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm text-muted-foreground">
                      {remarque.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>*/}

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
                  <LoaderCircle className="h-16 w-16 text-gray-500" />
                  <span className={"text-2xl font-medium"}>
                    Chargement en cours...
                  </span>
                </div>
              ) : (
                <ChartContainer
                  config={chartConfig}
                  className="h-full w-full aspect-auto"
                >
                  <AreaChart data={waterLevelData}>
                    <defs>
                      <linearGradient
                        id="waterGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--chart-3)"
                          stopOpacity={0.3}
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
                    <YAxis hide domain={[dataMin - 0.1, "dataMax + 0.1"]} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      cursor={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="haut"
                      stroke="var(--chart-3)"
                      strokeWidth={2}
                      fill="url(#waterGradient)"
                    />
                  </AreaChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ToutVoir;
