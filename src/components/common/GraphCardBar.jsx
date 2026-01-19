import React, { useMemo } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";

function GraphCardBar({ titre, texte, reponses = [] }) {
  // Transformer les reponses en données pour le graphique
  const chartData = useMemo(() => {
    return reponses.map((r) => ({
      name: r.label,
      value: r.value,
      fill: r.color,
    }));
  }, [reponses]);

  // Créer la config du chart dynamiquement
  const chartConfig = useMemo(() => {
    const config = {
      value: { label: "Réponses" },
    };
    reponses.forEach((r) => {
      config[r.label] = { label: r.label, color: r.color };
    });
    return config;
  }, [reponses]);

  // Calculer le total des réponses
  const totalReponses = useMemo(() => {
    return reponses.reduce((sum, r) => sum + r.value, 0);
  }, [reponses]);

  return (
    <Card>
      <CardContent className={"gap-6 flex flex-col"}>

        <div className={"flex-col flex gap-2"}>
          <span className={"text-base font-semibold"}>{titre}</span>
          <span className={"text-sm font-normal text-muted-foreground"}>{texte}</span>
        </div>

        <ChartContainer
          config={chartConfig}
          className="w-full max-h-[250px]"
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 0, right: 20 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              width={120}
              tick={{ fill: "var(--foreground)", fontSize: 12 }}
            />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--foreground)", fontSize: 12 }}
            />
            <ChartTooltip
              cursor={{ fill: "rgba(255,255,255,0.1)" }}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey="value"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>

        <div className="flex justify-center">
          <span className={"text-sm font-medium"}>Nombre de réponses : {totalReponses}</span>
        </div>

      </CardContent>
    </Card>
  );
}

export default GraphCardBar;


