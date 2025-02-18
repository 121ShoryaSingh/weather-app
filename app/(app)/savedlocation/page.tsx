"use client";
import SearchBar from "@/components/SearchBar";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResonse";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

// Define the type for a saved location
interface Location {
    latitude: number;
    longitude: number;
}

export default function Page() {
    const [dateInfo, setDateInfo] = useState({
        day: "",
        date: "",
        month: "",
        year: "",
    });

    const [savedLocations, setSavedLocations] = useState<Location[]>([]);
    const [weatherData, setWeatherData] = useState<any[]>([]); // Can be improved with a proper type

    // Fetch saved locations
    const fetchSavedLocation = async () => {
        try {
            const response = await axios.get("/api/get-saved-location");
    
            if (response.status === 204) {
                console.log("No saved cities found");
                setSavedLocations([]);
            } else if (response.data.success) {
                console.log("Saved Locations:", response.data.savedLocations);
                setSavedLocations(response.data.savedLocations);
            }
        } catch (error) {
            console.error("Error fetching saved locations:", error);
            const axiosError = error as AxiosError<ApiResponse>;
				let errorMessage = axiosError.response?.data.message;
				toast({
					title: 'Error fetching user data',
					description: errorMessage,
					variant: 'destructive',
				});
        }
    };

    useEffect(() => {
        fetchSavedLocation();
    }, []);

    // Fetch weather data
    useEffect(() => {
        const fetchWeatherData = async () => {
            if (savedLocations.length === 0) return;
        
            try {
                const weatherResponses = await Promise.all(
                    savedLocations.map(async (location) => {
                        const response = await axios.post("/api/get-weather", {
                            latitude: location.latitude,
                            longitude: location.longitude,
                        });
                        return response.data;
                    })
                );
                setWeatherData(weatherResponses);
                
                
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        };

        fetchWeatherData();
    }, [savedLocations]);
    
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
        <div>
            <div className="max-w-screen-xl min-w-[23.4375rem] bg-gradient-to-br from-[#2A3848] to-[#0A0708] rounded-lg py-2 mx-auto">
                {/* Search bar */}
                <div className="w-full max-w-screen-xl mx-auto flex justify-between lg:px-10 px-5">
                    <SearchBar />
                    <div className="flex justify-center gap-5">
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


            {/* Display Weather Data */}
            <div className="mt-2 max-w-screen-xl min-w-[23.4375rem] rounded-lg py-2 mx-auto">
                {weatherData.length > 0 ? (
                    <ul className="flex flex-col gap-2 w-full">
                        {weatherData.map((weather, index) => (
                            <Link
                             key={index}
                            href={`/search?city=${encodeURIComponent(weather.data.name)}&id=${index}&lat=${weather.data.latitude}&lon=${weather.data.longitude}&country=${weather.data.country}`} 
                            className="py-2 px-5 flex bg-gradient-to-br from-[#2A3848] to-[#0A0708] text-[#99A1A8] justify-between items-center border-b-2 border-gray-600 rounded-xl"
                            >
                                <span className="text-2xl font-semibold">{weather.data.name},{weather.data.country}</span>
                                <div className="grid grid-cols-3 grid-flow-col place-items-center">
                                    <img src={`https://openweathermap.org/img/wn/${weather.data.icon}@2x.png`} alt="" />
                                    <span className="text-xl">
                                        {weather.data.temperature}°C
                                    </span>
                                    <span className="capitalize text-xl">
                                        {weather.data.description}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 text-center">No weather data available.</p>
                )}
            </div>
        </div>
    );
}
