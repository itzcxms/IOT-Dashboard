import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { PieChart, Pie, LabelList } from "recharts"

function GraphCardPie({ titre, texte, reponses = [] }) {
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
      config[r.label] = { label: r.label };
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
          className="mx-auto aspect-square w-full max-h-[250px]"
        >
          <PieChart width={250} height={250}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="value" nameKey="name">
              {/* <LabelList
                dataKey="name"
                fill="white"
                stroke="none"
                fontWeight={400}
              /> */}
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="flex justify-center">
          <span className={"text-sm font-medium"}>Nombre de réponses : {totalReponses}</span>
        </div>

      </CardContent>
    </Card>
  );
}

export default GraphCardPie;

