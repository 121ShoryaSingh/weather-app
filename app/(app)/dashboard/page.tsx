"use client"
import React from 'react'
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { ApiResponse } from '@/types/ApiResonse';
import { toast } from '@/hooks/use-toast';
import Dashboard from '@/components/Dashboard';
import { string } from 'zod';

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

  const [user, setUser] = useState<User>();
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
    <div>
      <Dashboard user={user ?? {}} isLoading={loading} error={error ?? ""} />
    </div>
  );
};


export default page
