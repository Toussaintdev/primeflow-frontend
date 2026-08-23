"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

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
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMontant } from "@/lib/format";

const chartConfig = {
  montant: { label: "Montant" },
  individuel: { label: "Individuel", color: "var(--chart-1)" },
  collectif: { label: "Collectif", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function RepartitionPrimesChart({
  montantIndividuel,
  montantCollectif,
  loading,
}: {
  montantIndividuel: number;
  montantCollectif: number;
  loading: boolean;
}) {
  const total = montantIndividuel + montantCollectif;
  const data = [
    {
      type: "individuel",
      montant: montantIndividuel,
      fill: "var(--color-individuel)",
    },
    {
      type: "collectif",
      montant: montantCollectif,
      fill: "var(--color-collectif)",
    },
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Individuel vs Collectif</CardTitle>
        <CardDescription>Dernière période calculée</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {loading ? (
          <Skeleton className="mx-auto h-40 w-40 rounded-full" />
        ) : total === 0 ? (
          <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
            Aucune donnée
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-50"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value) => formatMontant(value as number)}
                  />
                }
              />
              <Pie
                data={data}
                dataKey="montant"
                nameKey="type"
                innerRadius={45}
                strokeWidth={4}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-lg font-bold"
                          >
                            {formatMontant(total)}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
