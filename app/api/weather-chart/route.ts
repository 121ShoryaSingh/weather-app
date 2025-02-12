
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import axios from "axios";
import { ChartDataPoint } from "@/types/types";

export async function POST(request: Request) {

  // Get the session
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated
  if (!session || !session?.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  try {
    const { lat, lon } = await request.json();

    if (!lat || !lon) {
      return Response.json(
        {
          success: false,
          message: "Latitude and Longitude are required",
        },
        { status: 400 }
      );
    }

    const chartDataURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m`;
    const { data } = await axios.get(chartDataURL);

    // Extract & format hourly data
    const hourlyData = data.hourly.time.map((time: string, index: number) => ({
      date: time.split("T")[0], // Extract YYYY-MM-DD for grouping
      temperature: data.hourly.temperature_2m[index],
    }));

    // Function to calculate daily averages
    const getDailyAverages = (hourlyData: any) => {
      const dailyMap = new Map();
    
      hourlyData.forEach(({ date, temperature }: ChartDataPoint) => {
        const day = date.split("-")[2]; // Extract only the day (DD)
    
        if (!dailyMap.has(day)) {
          dailyMap.set(day, { totalTemp: 0, count: 0 });
        }
    
        const dailyEntry = dailyMap.get(day);
        dailyEntry.totalTemp += temperature;
        dailyEntry.count++;
        dailyMap.set(day, dailyEntry);
      });
    
      return Array.from(dailyMap.entries()).map(([day, { totalTemp, count }]) => ({
        day, // Now only DD format
        avgTemp: totalTemp / count, // Calculate average
      }));
    };

    // Get daily averages
    const dailyAverages = getDailyAverages(hourlyData);

    return Response.json(dailyAverages, { status: 200 });

  } catch (error) {
    console.error("Error fetching weather data", error);
    return Response.json(
      {
        success: false,
        message: "Error fetching data from OpenMeteo",
      },
      { status: 500 }
    );
  }
}
