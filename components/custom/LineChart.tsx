"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

export type PointEvolution = {
  label: string;
  total: number;
};

const chartConfig = {
  total: {
    label: "Total des primes",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function EvolutionPrimesChart({
  data,
  loading,
}: {
  data: PointEvolution[];
  loading: boolean;
}) {
  const tendance =
    data.length >= 2
      ? data[data.length - 1].total - data[data.length - 2].total
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution des primes</CardTitle>
        <CardDescription>
          Montant total versé, par période de calcul
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-62.5 w-full" />
        ) : data.length === 0 ? (
          <div className="h-62.5 flex items-center justify-center text-muted-foreground text-sm">
            Aucun calcul de prime n'a encore été effectué.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="max-h-62.5 w-full">
            <LineChart
              accessibilityLayer
              data={data}
              margin={{ top: 20, left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis hide />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    formatter={(value) => formatMontant(value as number)}
                  />
                }
              />
              <Line
                dataKey="total"
                type="natural"
                stroke="var(--color-total)"
                strokeWidth={2}
                dot={{ fill: "var(--color-total)" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
      {data.length >= 2 && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            {tendance >= 0 ? (
              <>
                En hausse de {formatMontant(Math.abs(tendance))} par rapport à
                la période précédente{" "}
                <TrendingUp className="h-4 w-4 text-success" />
              </>
            ) : (
              <>
                En baisse de {formatMontant(Math.abs(tendance))} par rapport à
                la période précédente{" "}
                <TrendingDown className="h-4 w-4 text-destructive" />
              </>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
