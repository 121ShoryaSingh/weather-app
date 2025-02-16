"use client";

import RainForecast from "@/components/ChancesOfRain";
import HoursUntil from "@/components/HoursUntil";
import SaveButton from "@/components/SaveButton";
import SearchBar from "@/components/SearchBar";
import TodayOverview from "@/components/TodayOverview";
import WeatherChart from "@/components/WeatherChart";
import { WeatherData } from "@/types/types";
import axios from "axios";
import { Sunrise, Sunset } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const searchParams = useSearchParams();
    const [dateInfo, setDateInfo] = useState({
        day: "",
        date: "",
        month: "",
        year: "",
    });

    const city = searchParams.get("city");
    const country = searchParams.get("country");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    const latitude = lat ? parseFloat(lat) : null;
	const longitude = lon ? parseFloat(lon) : null;

    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch weather data
    useEffect(() => {
        if (!city || !country) return;

        const fetchWeather = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await axios.post(`/api/weather`, {
                     city, 
                     country,
                });
                setWeatherData(response.data.data);
                console.log(weatherData)
            } catch (err) {
                setError("Failed to fetch weather data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [city, country]);

    // Update date info
    useEffect(() => {
        const today = new Date();
        setDateInfo({
            day: new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(today),
            date: today.getDate().toString(),
            month: new Intl.DateTimeFormat("en-US", { month: "long" }).format(today),
            year: today.getFullYear().toString(),
        });
    }, []);

    return (
			<div className="">
				<div className="max-w-screen-xl min-w-[23.4375rem] bg-gradient-to-br from-[#2A3848] to-[#0A0708] rounded-lg py-2 mx-auto">
					{/* Search Bar & Date */}
					<div className="w-full max-w-screen-xl mx-auto flex justify-between lg:px-10 px-5">
						<SearchBar />
						<div className="flex justify-center gap-5">
							<div className="flex justify-center">
								<SaveButton latitude={latitude} longitude={longitude} />
							</div>
							<div className="hidden md:flex flex-col text-[#9199A1] max-w-[12rem]">
								<span className="text-lg font-bold">
									{dateInfo.month} {dateInfo.year}
								</span>
								<span className="text-lg font-bold">
									{dateInfo.day}, {dateInfo.date}, {dateInfo.year}
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="mx-auto max-w-screen-xl min-w-[23.4375rem] bg-gradient-to-br from-[#2A3848] to-[#0A0708] rounded-lg sm:p-5 text-center mt-2">
					{/* Show loading message */}
					{loading && (
						<p className="text-lg text-gray-400">Loading weather data...</p>
					)}

					{/* Show error message if fetching fails */}
					{error && <p className="text-lg text-red-500">{error}</p>}

					{/* Show weather data only if available */}
					{!loading && !error && weatherData && (
						<div className="flex max-w-screen-xl mx-auto lg:flex-row flex-col">
							<div className="max-w-screen-sm min-w-[23.4375rem] w-full mx-auto">
								<div className="rounded-lg p-5">
									{/* Weather Icon, Temperature, and Description */}
									<div className="flex flex-col text-center text-[#99A1A8] gap-3">
										<img
											src={`https://openweathermap.org/img/wn/${weatherData?.icon}@2x.png`}
											alt="Weather Icon"
											className="object-cover mx-auto md:h-28 md:w-28 w-16 h-16"
										/>
										<span className="text-lg font-bold">
											{weatherData?.temperature}°C
										</span>
										<span className="capitalize text-lg font-bold">
											{weatherData?.description}
										</span>
									</div>
									<div className="lg:hidden flex text-[#99A1A8] opacity-60 text-2xl font-bold pt-5">
										{city}
									</div>
									{/* Rain Forecast */}
									<div className="">
										<RainForecast
											lat={latitude}
											lon={longitude}
										/>
									</div>

									{/* Sunrise and Sunset */}
									<div className="pt-9 px-5 w-full">
										<h2 className="text-[#99A1A8] text-2xl font-semibold">
											SUNRISE AND SUNSET
										</h2>
										<div className="flex justify-evenly text-[#99A1A8] opacity-60 pt-6 text-lg">
											<Sunrise size={30} />
											<div className="flex flex-col">
												<span>SUNRISE</span>
												<span className="text-right">
													{weatherData?.sunrise}
												</span>
											</div>
											<div>
												<HoursUntil targetTime={weatherData?.sunrise} />
											</div>
										</div>
										<div className="flex justify-evenly text-[#99A1A8] opacity-60 py-6 text-lg">
											<Sunset size={30} />
											<div className="flex flex-col">
												<span>SUNSET</span>
												<span className="text-right">
													{weatherData?.sunset}
												</span>
											</div>
											<div>
												<HoursUntil targetTime={weatherData?.sunset} />
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="space-y-10 max-w-screen-sm mx-auto">
								<div className="lg:flex hidden justify-center text-[#99A1A8] opacity-60 text-2xl font-bold pt-10">
									{city}
								</div>
								<TodayOverview weather={weatherData} />
								<WeatherChart
									lat={latitude}
									lon={longitude}
								/>
							</div>
						</div>
					)}

					{/* No data case */}
					{!loading && !error && !weatherData && (
						<p className="text-lg text-gray-400">No weather data available.</p>
					)}
				</div>
			</div>
		);
}
