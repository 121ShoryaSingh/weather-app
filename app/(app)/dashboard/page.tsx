"use client"
import React from 'react'
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { ApiResponse } from '@/types/ApiResonse';
import { toast } from '@/hooks/use-toast';

interface User {
  _id?: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  city?: string;
  country?: string;
}

interface WeatherData {
  temp: string;
  feels_like: string;
  pressure: string;
  humidity: string;
  windspeed: string;
  sunrise: string;
  sunset: string;
}

const page = () => {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const response = await axios.get("/api/user", { withCredentials: true });
            setUser(response.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error fetching user");
        }
    };

    fetchUser();
}, []);

  // useEffect(()=> {
  //   const fetchWeather = async () => {  
  //     try {
  //       const response = await axios.post(
  //         "/api/weather",
  //         { city: user?.city, country: user?.country },
  //         { headers: { "Content-Type": "application/json" } }
  //       );
  //       console.log(response.data)
  //       // Store extracted data in state
  //       const {
  //         main: { temp, feels_like, pressure, humidity },
  //         wind: { speed: windspeed },
  //         sys: { sunrise, sunset }
  //       } = response.data;
  
  //       // ✅ Set weather state with extracted data
  //       setWeather({
  //         temp,
  //         feels_like,
  //         pressure,
  //         humidity,
  //         windspeed,
  //         sunrise,
  //         sunset, // Already formatted in API
  //       });
  //     } catch (error) {
  //       console.error('Error in fetching Weather Data', error);
  //             const axiosError = error as AxiosError<ApiResponse>;
  //             let errorMessage = axiosError.response?.data.message;
  //             toast({
  //               title: 'Error fetching user data',
  //               description: errorMessage,
  //               variant: 'destructive',
  //             });
  //     }
      
  //   }
  // },[user])


  return (
    <div className="w-full">
      {loading ? (
        <p className="text-center text-gray-500">Loading user data...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1">
          <div className="bg-gradient-to-br from-[#2A3848] to-[#0A0708] px-10">
            <h1 className="text-white text-2xl">Welcome, {user?.username}</h1>
            <p className="text-gray-300">Location: {user?.city}, {user?.country}</p>
          </div>

          {weather && (
            <div className="bg-gray-800 text-white p-6 mt-4 rounded-lg">
              <h2 className="text-xl font-semibold">Weather Data</h2>
              <p>🌡️ Temperature: {weather.temp}°C</p>
              <p>🤗 Feels Like: {weather.feels_like}°C</p>
              <p>🌬️ Wind Speed: {weather.windspeed} m/s</p>
              <p>🌄 Sunrise: {weather.sunrise}</p>
              <p>🌇 Sunset: {weather.sunset}</p>
              <p>💨 Pressure: {weather.pressure} hPa</p>
              <p>💦 Humidity: {weather.humidity}%</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export default page
