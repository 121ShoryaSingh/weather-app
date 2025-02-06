"use client"
import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import WeatherBar from '@/components/WeatherBar';
import Search from '@/components/Search';


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
  const [error, setError] = useState<string>("");

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
    <div className='flex md:flex-row flex-col-reverse'>
      <div className='lg:w-[25rem]'>
        <WeatherBar user={user ?? {}} isLoading={loading} error={error ?? ""} />
      </div>
      <div className='lg:w-full lg:ml-5'>
        <Search/>
      </div>
    </div>
  );
};


export default page
