"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
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
import axios from "axios"
import { useEffect, useState } from "react"
import { WeatherChartProps } from "@/types/types"

// Chart config for temperature data
const chartConfig = {
  temperature: {
    label: "Temperature",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function WeatherChart({ lat, lon }: WeatherChartProps) {
  const [chartData, setChartData] = useState<{ date: string; avgTemp: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lat === undefined || lon === undefined) return; 

    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/weather-chart", { lat, lon });

        if (Array.isArray(response.data)) {
          setChartData(response.data);
          console.log(response.data)
        } else {
          console.error("Unexpected API response:", response.data);
          setChartData([]);
        }
      } catch (error) {
        console.error("Error fetching weather data", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [lat, lon]);

  return (
		<div>
			<h1 className=" lg:pl-5 text-xl font-bold text-[#8793A0]">
				AVERAGE WEEKLY TEMPERATURE
			</h1>
			<div className="lg:pl-10 mt-5">
				<Card className="">
					<CardContent>
						{loading ? (
							<p>Loading data...</p>
						) : error ? (
							<p className="text-red-500">{error}</p>
						) : (
							<ChartContainer config={chartConfig}>
								<LineChart
									data={chartData}
									margin={{ left: 12, right: 12 }}>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="day"
										tickLine={false}
										axisLine={false}
										tickMargin={8}
										tickFormatter={(value) => value.slice(0, 5)}
									/>
									<ChartTooltip
										cursor={false}
										content={<ChartTooltipContent hideLabel />}
									/>
									<YAxis
										dataKey="avgTemp"
										tickLine={false}
										axisLine={false}
										tickMargin={4}
										domain={[0, 50]}
										ticks={[0, 10, 20, 30, 40, 50]}
									/>
									<Line
										dataKey="avgTemp"
										type="natural"
										stroke={chartConfig.temperature.color}
										strokeWidth={2}
										dot={false}
									/>
								</LineChart>
							</ChartContainer>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}



