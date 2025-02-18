'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import axios from 'axios';
import { City } from '@/types/types';
import { useRouter } from 'next/navigation';


export default function SearchBar() {
	const [searchTerm, setSearchTerm] = useState('');
	const [suggestions, setSuggestions] = useState<City[]>([]);
	const [loading, setLoading] = useState(false);
	const inputRef = useRef<HTMLInputElement | null>(null);
    const router = useRouter()

	useEffect(() => {
		if (searchTerm.length < 3) {
			setSuggestions([]);
			return;
		}

		const fetchCities = async () => {
			setLoading(true);
			try {
				const response = await axios.get<City[]>('/api/search-cities', {
					params: { query: searchTerm },
				});

				setSuggestions(response.data); 
				console.log(suggestions);
			} catch (error) {
				console.error('Error fetching city data:', error);
				setSuggestions([]);
			} finally {
				setLoading(false);
			}
		};

		const debounceTimeout = setTimeout(fetchCities, 1000);
		return () => clearTimeout(debounceTimeout);
	}, [searchTerm]);

	const handleCitySelect = (city: City) => {
		setSearchTerm(city.name);
    setSuggestions([]);
    router.push(
        `/search?city=${encodeURIComponent(city.name)}&id=${city.id}&lat=${city.latitude}&lon=${city.longitude}&country=${city.country}`
      );
    if (inputRef.current) {
      inputRef.current.blur();
	};
}

	return (
		<div className="relative w-full md:max-w-md">
			<div className="flex items-center rounded-lg p-2">
				<SearchIcon className="w-5 h-5 text-gray-500 mr-2" />
				<Input
					ref={inputRef}
					type="text"
					placeholder="Search city..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="flex-1 bg-white border-none focus:ring-0 rounded-full"
				/>
                </div>

				{suggestions === null ? null : suggestions.length > 0 ? (
					<div className="absolute w-full bg-white shadow-md rounded-md mt-2 z-10">
						<div className="p-2">

							<ul className="mt-1">
								{suggestions.map((city) => (
									<li
										key={city.id}
										className="p-2 hover:bg-gray-100 cursor-pointer rounded-md"
										onClick={() => handleCitySelect(city)}>
										{city.name}
									</li>
								))}
							</ul>
						</div>
					</div>
				) : !loading && searchTerm.length >= 3 ? (
					<p className='text-white ml-8'>No results found.</p>
				) : null}

				{loading && <p className="text-sm text-gray-500 mt-2">Loading...</p>}
			
		</div>
	);
}
