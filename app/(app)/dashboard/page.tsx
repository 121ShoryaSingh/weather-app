"use client"
import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import WeatherBar from '@/components/WeatherBar';
import Search from '@/components/Search';
import TodayOverview from '@/components/TodayOverview';
import { WeatherData, User } from '@/types/types';




const page = () => {

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleDataFromChild = (Data: WeatherData | null ) => {
    setWeatherData(Data);
  };
    console.log(weatherData)


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

  

  return (
		<div className="flex md:flex-row flex-col-reverse">
			<div className="lg:w-[25rem]">
				<WeatherBar
					user={user ?? {}}
					isLoading={loading}
					error={error ?? ''}
					setWeatherData={handleDataFromChild}
				/>
			</div>
			<div className="lg:w-full lg:ml-5 mb-5">
				<Search />
				<div>
					<TodayOverview weather={weatherData} />
				</div>
			</div>
		</div>
	);
};


export default page
