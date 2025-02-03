'use client'
import React, { useEffect, useState }   from 'react'
import axios, { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/ApiResonse';

interface props {
	user: {
		_id?: string;
		username?: string;
		firstname?: string;
		lastname?: string;
		city?: string;
		country?: string;
	};
  isLoading: boolean;
  error: string;
}

interface WeatherData {
    temperature: string;
    feels_like: string;
    pressure: string;
    humidity: string;
    windspeed: string;
    sunrise: string;
    sunset: string;
  }

const Dashboard = ({user, isLoading, error}: props) => {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  
  useEffect(()=> {
    const fetchWeather = async () => {  
      try {
        const response = await axios.post(
          "/api/weather",
          { city: user?.city, country: user?.country },
          { headers: { "Content-Type": "application/json" } }
        );
        console.log(response.data)
        // Store extracted data in state
        const {temperature, feels_like, pressure, humidity, windspeed, sunrise, sunset 
        } = response.data.data;
  
        // ✅ Set weather state with extracted data
        setWeather({
          temperature,
          feels_like,
          pressure,
          humidity,
          windspeed,
          sunrise,
          sunset,
        });
      } catch (error) {
        console.error('Error in fetching Weather Data', error);
              const axiosError = error as AxiosError<ApiResponse>;
              let errorMessage = axiosError.response?.data.message;
              toast({
                title: 'Error fetching user data',
                description: errorMessage,
                variant: 'destructive',
              });
      }
      
    }
    if(user?.city && user?.country) {
      fetchWeather()
    }
  },[user])
  
    return (
      <div>
        <div className="w-full">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading user data...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className=" w-full grid grid-cols-1">
            <div className="bg-gradient-to-br from-[#2A3848] to-[#0A0708] px-10">
              <h1 className="text-white text-2xl">Welcome, {user?.username}</h1>
              <p className="text-gray-300">Location: {user?.city}, {user?.country}</p>
            </div>

            {weather && (
              <div >

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
