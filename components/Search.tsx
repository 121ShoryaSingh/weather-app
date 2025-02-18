'use client'


import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBar';

const Search = () => {
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

    return (
      <div className='lg:w-full lg:max-w-screen-xl max-w-screen-sm min-w-[23.4375rem] w-full px-5'>
        <div className='w-full lg:rounded-l-xl rounded-lg bg-gradient-to-br from-[#2A3848] to-[#0A0708]'>
            <div className='w-full flex px-5 py-4 justify-between'>
                <div className=' hidden md:flex flex-col text-[#9199A1] max-w-[12rem]'>
                    <span className='text-lg font-bold'>{dateInfo.month} {dateInfo.year}</span>
                    <span className='text-lg font-bold'>{dateInfo.day}, {dateInfo.date}, {dateInfo.year}</span>
                </div>
                <div className='w-full md:w-auto'>
                    <SearchBar />
                </div>
            </div>
        </div>
      </div>
    );
};

export default Search;