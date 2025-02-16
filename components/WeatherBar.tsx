'use client'
import React, { useEffect, useState }   from 'react'
import axios, { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/ApiResonse';
import RainForecast from './ChancesOfRain';
import HoursUntil from './HoursUntil';
import { Sunrise, Sunset } from 'lucide-react';
import { WeatherData, User } from '@/types/types';

 

interface props {
  user: User
  isLoading: boolean;
  error: string;
  setWeatherData: (data: WeatherData | null) => void;
}


const WeatherBar = ({user, isLoading, error, setWeatherData}: props) => {
	const [weather, setWeather] = useState<WeatherData | null>(null);
	const [time, setTime] = useState<string>('');
	
	useEffect(() => {
		const fetchWeather = async () => {
			try {
				const response = await axios.post(
					'/api/weather',
					{ city: user?.city, country: user?.country },
					{ headers: { 'Content-Type': 'application/json' } }
				);

				// Store extracted data in statez
				const newWeather: WeatherData = response.data.data;

				setWeather(newWeather);
				setWeatherData(newWeather);
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
		};
		if (user?.city && user?.country) {
			fetchWeather();
		}
	}, [user]);

	useEffect(() => {
		const updateTime = () => {
			const now = new Date();
			setTime(
				new Intl.DateTimeFormat('en-US', {
					hour: '2-digit',
					minute: '2-digit',
					hour12: true,
				}).format(now)
			);
		};

		updateTime(); 
		const interval = setInterval(updateTime, 60000); // Update every second

		return () => clearInterval(interval); // Cleanup on unmount
	}, []);

	return (
		<div>
			<div className="w-full">
				{isLoading ? (
					<p className="text-center text-[#99A1A8]">Loading user data...</p>
				) : error ? (
					<p className="text-center text-red-500">{error}</p>
				) : (
					<div>
						<div className=" w-full lg:flex hidden">
							<div className="h-screen w-[25rem] bg-gradient-to-br from-[#2A3848] to-[#0A0708] xl:px-5 px-2 rounded-tr-3xl">
								<div className="flex justify-between px-5 pt-9">
									<div className="flex flex-col text-[#99A1A8] text-center">
										<span className="capitalize text-2xl font-semibold">
											{user.firstname} {user.lastname}
										</span>
										<span className="capitalize text-xl font-semibold">
											{user.city}, {user.country}
										</span>
									</div>
									<span className="capitalize text-2xl font-medium text-[#99A1A8] py-3 opacity-60">
										{time}
									</span>
								</div>
								<div className="flex justify-around px-5 xl:pt-5">
									<div className="flex flex-col text-center">
										<img
											src={`https://openweathermap.org/img/wn/${weather?.icon}@2x.png`}
											alt="Weather Icon"
											className="object-cover xl:h-28 xl:w-28 w-20 h-20"
										/>
										<span className="text-3xl font-semibold text-[#99A1A8]">
											{weather?.temperature}°C
										</span>
									</div>
									<span className="capitalize text-2xl font-medium text-[#99A1A8] py-3 opacity-60 my-auto">
										{weather?.description}
									</span>
								</div>
								<div>
									<RainForecast
										lat={weather?.lat}
										lon={weather?.lon}
									/>
								</div>
								<div className="pt-9 px-5 w-full">
									<h2 className="text-[#99A1A8] text-2xl font-semibold">
										SUNRISE AND SUNSET
									</h2>
									<div className="flex justify-evenly text-[#99A1A8] opacity-60 pt-6 text-lg">
										<Sunrise size={30} />
										<div className="flex flex-col">
											<span className="">SUNRISE</span>
											<span className="text-right">{weather?.sunrise}</span>
										</div>
										<div>
											<HoursUntil targetTime={weather?.sunrise} />
										</div>
									</div>
									<div className="flex justify-evenly text-[#99A1A8] opacity-60 py-6 text-lg">
										<Sunset size={30} />
										<div className="flex flex-col">
											<span className="">SUNSET</span>
											<span className="text-right">{weather?.sunset}</span>
										</div>
										<div>
											<HoursUntil targetTime={weather?.sunset} />
										</div>
									</div>
								</div>
							</div>
						</div>
						
					</div>
				)}
			</div>
		</div>
	);
}

export default WeatherBar
