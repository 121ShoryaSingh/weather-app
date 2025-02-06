'use client'

import { SearchIcon, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const Search = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [dateInfo, setDateInfo] = useState({
        day: '',
        date: '',
        month: '',
        year: '',
    });

    useEffect(() => {
        const updateDate = () => {
            const today = new Date();

            setDateInfo({
                day: new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today),
                date: today.getDate().toString(),
                month: new Intl.DateTimeFormat('en-US', { month: 'long' }).format(today),
                year: today.getFullYear().toString(),
            });
        };

        updateDate();
    }, []);

    useEffect(() => {
        // Focus the input when the search bar opens
        if (isSearchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isSearchOpen]);


    const handleSearchChange = (e: any) => {
        setSearchTerm(e.target.value);
        // Here you can add your search logic, e.g., filtering data
        console.log("Search term:", e.target.value); // Placeholder
    };

    const handleSearchSubmit = (e: any) => {
        e.preventDefault(); // Prevent form submission
        // Perform search based on searchTerm
        console.log("Searching for:", searchTerm);
        // Close the search bar after submit (optional)
        setIsSearchOpen(false);
        setSearchTerm(''); // Clear the input field
        if (inputRef.current) {
            inputRef.current.blur(); // Remove focus after search
        }
    };

    const handleSearchClear = () => {
        setSearchTerm('');
        if (inputRef.current) {
            setIsSearchOpen(!isSearchOpen)
            inputRef.current.focus(); // Refocus after clear
        }
    };

    return (
      <div className='lg:w-full lg:max-w-screen-xl max-w-screen-sm min-w-[23.4375rem] w-full px-5'>
        <div className='w-full lg:rounded-l-xl rounded-lg  bg-gradient-to-br from-[#2A3848] to-[#0A0708] '>
            <div className='w-full flex px-5 py-4 justify-between'>
                <div className={`flex flex-col text-[#9199A1] max-w-[9rem] `}>
                    <span className='text-lg font-bold'>{dateInfo.month} {dateInfo.year}</span>
                    <span className='text-lg font-bold '>{dateInfo.day}, {dateInfo.date}, {dateInfo.year}</span>
                </div>
                <div className="flex items-center gap-2">
                    <form onSubmit={handleSearchSubmit} className={`flex items-center transition-all duration-300 ease-in-out overflow-hidden bg-white rounded-full ${isSearchOpen ? 'w-64 px-4 py-2' : 'w-0 p-0'} md:w-64 md:px-4 md:py-2`}> {/* Added form element */}
                        <input
                            ref={inputRef}
                            type="text"
                            className={`bg-transparent w-full text-gray-800 outline-none ${isSearchOpen ? 'block' : 'hidden'}`}
                            placeholder="Search..."
                            value={searchTerm} // Controlled input
                            onChange={handleSearchChange} // Handle input change
                        />
                        {isSearchOpen && (
                            <button
                                type="button" // Prevent form submission
                                onClick={handleSearchClear}
                                className="text-gray-800 ml-2"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </form>

                    {!isSearchOpen && (
                        <button
                            className="text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <SearchIcon size={24} />
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>
    );
};

export default Search;