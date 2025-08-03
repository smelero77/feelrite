"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "Un gráfico de línea para el bienestar emocional"

const chartData = [
  { mes: "Enero", bienestar: 7.2 },
  { mes: "Febrero", bienestar: 6.8 },
  { mes: "Marzo", bienestar: 8.1 },
  { mes: "Abril", bienestar: 7.9 },
  { mes: "Mayo", bienestar: 8.5 },
  { mes: "Junio", bienestar: 8.8 },
]

const chartConfig = {
  bienestar: {
    label: "Nivel de Bienestar",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartLineDefault() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progreso del Bienestar</CardTitle>
        <CardDescription>Enero - Junio 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="mes"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="bienestar"
              type="natural"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Mejorando un 22% este mes <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Mostrando el nivel de bienestar emocional de los últimos 6 meses
        </div>
      </CardFooter>
    </Card>
  )
} 