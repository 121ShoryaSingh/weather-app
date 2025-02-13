import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { City, CityFromAPI } from "@/types/types";


const API_KEY = process.env.OPEN_WEATHER_KEY;

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query");

        if (!query) {
            return new NextResponse(JSON.stringify({ error: "Missing search query" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`;


        const response = await axios.get<CityFromAPI[]>(url);

        const cities: City[] = response.data.map((city, index) => ({
            id: index + 1,
            name: `${city.name}, ${city.state},${city.country}`,
            latitude: city.lat,
            longitude: city.lon,
            country: city.country,
            state: city.state,
        }));

        return NextResponse.json(cities);

    } catch (error) {
        console.error("Error fetching city data:", error);
        return new NextResponse(JSON.stringify({ error: "Failed to fetch city data" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}