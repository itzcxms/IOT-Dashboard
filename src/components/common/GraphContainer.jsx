import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { NumToMois } from "@/functions/GestionnaireDates.jsx";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart.jsx";

function GraphContainer({
  ChartData,
  chartConfig,
  params,
  currentSelection,
  yAxisConfigs,
  line,
  isLoadingData,
  isLoadingParams,
}) {
  if (isLoadingParams || isLoadingData) return <div>Chargement...</div>;
  return (
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
        {params.datas.map((param, key) => {
          if (yAxisConfigs[param].domain[0] >= 0 && params.datas.length === 1) {
            return (
              <Area
                key={param}
                dataKey={param}
                yAxisId={param}
                type="linear"
                fill={`var(--multi-chart-${key + 1})`}
                fillOpacity={0.4}
                stroke={`var(--multi-chart-${key + 1})`}
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
                stroke={`var(--multi-chart-${key + 1})`}
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
  );
}

export default GraphContainer;
