import React, {useEffect, useState} from "react";
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
  CloudRain,
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
  switch (condition) {
    case "sunny":
      return <Sun className="h-8 w-8 text-yellow-500" />;
    case "cloudy":
      return <Cloud className="h-8 w-8 text-gray-400" />;
    case "rainy":
      return <CloudRain className="h-8 w-8 text-blue-400" />;
    default:
      return <Sun className="h-8 w-8 text-yellow-500" />;
  }
}

function ToutVoir() {
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [waterLevelData, setWaterLevelData] = useState(null);
  const [dataMin, setDataMin] = useState(null);

  // Données simulées (à remplacer par de vraies données)
  const weatherCondition = "sunny";
  const temperature = 24;
  const frequentation = 132;
  const contenanceSavon = 175;
  const hauteurEau = 1.23;
  const questionnaires = 5;

  useEffect(() => {
    async function fetchData() {
      let reponse = await generateCallsAPI(token, "POST", "/api/graphs/capteurs/today", {"type": "sonde"});
      const dataLen = Object.keys(reponse).length;
      if (dataLen > 0) {
        let min = parseInt(reponse.donnees[0].haut);
        for (let i = 1; i < reponse.donnees.length; i++) {
          if (parseInt(reponse.donnees[i].haut) < min) {
            min = parseInt(reponse.donnees[i].haut);
          }
        }
        setWaterLevelData(reponse.donnees);
        setDataMin(min);
        setIsLoading(false)
      }
    }
    if (isLoading) {
      void fetchData()
    }
  })

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
                <span className="text-5xl font-semi-bold">{temperature}°C</span>
              </div>

              {/* Météo */}
              <div className="mt-4 flex items-center gap-3">
                <WeatherIcon condition={weatherCondition} />
                <span className="text-sm font-medium">
                  {weatherCondition === "sunny"
                    ? "Ensoleillé"
                    : weatherCondition === "cloudy"
                      ? "Nuageux"
                      : "Pluvieux"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Grille de statistiques */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon={Users}
              title="Fréquentation"
              subtitle="du jour"
              value={frequentation}
              unit="personnes"
            />
            <StatCard
              icon={Droplets}
              title="Contenance estimée"
              subtitle="du savon"
              value={contenanceSavon}
              unit="mL"
            />
            <StatCard
              icon={Waves}
              title="Hauteur"
              subtitle="du jour"
              value={hauteurEau.toFixed(2).replace(".", ",")}
              unit="m"
            />
            <StatCard
              icon={ClipboardList}
              title="Questionnaires remplis"
              subtitle="semaine"
              value={questionnaires}
              unit="fois"
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
              {isLoading ? (<div>Chargement en cours...</div>) : (<ChartContainer
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
                      tick={{fontSize: 12, fill: "var(--muted-foreground)"}}
                  />
                  <YAxis hide domain={[dataMin - 0.1, "dataMax + 0.1"]}/>
                  <ChartTooltip
                      content={<ChartTooltipContent/>}
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
              </ChartContainer>)}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ToutVoir;
