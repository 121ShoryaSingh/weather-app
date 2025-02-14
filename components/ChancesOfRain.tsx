'use client'
import { BarChart } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar } from 'recharts';

const RainForecast = ({ lat, lon }: {lat:any, lon:any }) => {
  const [rainData, setRainData] = useState<{ time: string; rain: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lat === undefined || lon === undefined) {
        setLoading(true);
        return;
      }

    const fetchRainForecast = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=precipitation_probability&timezone=auto`
        );
        
        const data = await response.json();
        
        if (data?.hourly?.precipitation_probability) {
          // Get current time and the next 3 hours
          const rainForecast = data.hourly.precipitation_probability.slice(0, 4);

          // Format the time and prepare the data
          const formattedData = rainForecast.map((rain: any, index: any) => {
            const hour = new Date();
            hour.setHours(hour.getHours() + index); // Add index to get the next hours
            const time = hour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(/:\d{2}$/, ':00');

            return { time, rain };
          });
          
          setRainData(formattedData);
        } else {
          setError("Rain forecast data is unavailable");
        }
      } catch (error) {
        console.error("Error fetching rain forecast:", error);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchRainForecast();
  }, [lat, lon]);

  return (
		<div>
			{loading ? (
				<p className='text-[#99A1A8]'>Loading...</p>
			) : error ? (
				<p>{error}</p>
			) : (
				<div className='px-4 xl:mt-16 mt-3'>
          <h2 className='text-[#99A1A8] text-2xl font-semibold'>CHANCE OF RAIN</h2>
          <div className='flex flex-col xl:gap-5 xl:mt-6 lg:pt-0 lg:gap-0 pt-4 gap-5 '>
            {rainData.map((data, index) => (
              <div key={index} className="flex items-center space-x-4">
              <span className="w-16 text-sm font-medium text-[#99A1A8] opacity-60 ">{data.time}</span>
              <div className="flex-1 bg-[#3f5875] rounded-full h-4 relative">
                <div
                  className="bg-[#97afc6] h-4 rounded-full"
                  style={{ width: `${data.rain}%` }}
                ></div>
              </div>
              <span className="w-10 text-sm font-medium text-[#99A1A8] opacity-60">{data.rain}%</span>
            </div>
            ))}
          </div>
        </div>
			)}
		</div>
	);
};

export default RainForecast;