import { WeatherData } from '@/types/types';
import { Cloud, Droplets, Wind } from 'lucide-react';
import React from 'react'



interface Props {
    weather: WeatherData | null;
}


const TodayOverview = ({weather}: Props) => {

  return (
		<div className="mt-5 ">
			<h1 className="text-xl font-bold text-[#8793A0]">TODAY OVERVIEW</h1>
			<div className="grid md:grid-cols-2 grid-cols-1 justify-items-center mt-5 gap-3 px-5">
				<div className="bg-gradient-to-br from-[#2A3848] to-[#0A0708] md:w-[14.25rem] w-full rounded-xl">
					<div className="w-full py-4 text-[#99A1A8] flex items-center gap-5 pl-16 md:pl-10">
						<Wind />
						<div className="flex flex-col font-bold">
							<span>WINDSPEED</span>
							<span>{weather?.windspeed} KM/H</span>
						</div>
					</div>
				</div>
				<div className="bg-gradient-to-br from-[#2A3848] to-[#0A0708] md:w-[14.25rem] w-full rounded-xl">
					<div className="w-full py-4 text-[#99A1A8] flex items-center gap-5 pl-16 md:pl-10">
						<Cloud />
						<div className="flex flex-col font-bold">
							<span>Clouds</span>
							<span>{weather?.all}</span>
						</div>
					</div>
				</div>
				<div className="bg-gradient-to-br from-[#2A3848] to-[#0A0708] md:w-[14.25rem] w-full rounded-xl">
					<div className="w-full py-4 text-[#99A1A8] flex items-center gap-5 pl-16 md:pl-10">
						<img
							src="pressure.svg"
							alt=""
							className=""
						/>
						<div className="flex flex-col font-bold">
							<span>PRESSURE</span>
							<span>{weather?.pressure} HPA</span>
						</div>
					</div>
				</div>
				<div className="bg-gradient-to-br from-[#2A3848] to-[#0A0708] md:w-[14.25rem] w-full rounded-xl">
					<div className="w-full py-4 text-[#99A1A8] flex items-center gap-5 pl-16 md:pl-10">
						<Droplets />
						<div className="flex flex-col font-bold">
							<span>HUMIDITY</span>
							<span>{weather?.humidity}%</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default TodayOverview
