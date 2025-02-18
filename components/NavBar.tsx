'use client'
import React, { useState } from 'react'
import Logo from './Logo'
import Image from 'next/image'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { Menu, X } from 'lucide-react'




const info = [
    {key:1, title:'DASHBOARD' , link:'/dashboard' , icon:'/home.svg'},
    {key:2, title:'SAVED LOCATION', link:'/savedlocation', icon:'/location.svg'},
]

const NavBar = () => {

    const {data: session} = useSession();
    const user: User = session?.user as User
    const [ isOpen , setIsOpen ] = useState(false);

    const toggleNav = () => {
        setIsOpen(!isOpen)
    }

  return (
		<nav className="max-w-screen-xl min-w-[23.4375rem] w-full mx-auto py-2">
			<div className=" mx-auto">
				<div className="w-full flex justify-between px-10">
					<div className="">
						<Link href="/dashboard">
							<Logo />
						</Link>
					</div>
					<div className="md:block hidden w-full my-auto">
						<div className="flex justify-end ">
							<div className="flex justify-center items-center mx-auto gap-4">
								{info.map((data) => {
									return (
										<Link
											href={data.link}
											key={data.key}
											className="flex gap-2">
											<Image
												src={data.icon}
												alt="icon"
												width={20}
												height={20}
											/>
											<span className="text-[#858382] font-semibold">
												{data.title}
											</span>
										</Link>
									);
								})}
							</div>
							<div className="flex justify-center items-center">
								{session ? (
									<div className="flex items-center gap-2  ">
										<span className="font-bold">Welcome {user.username}</span>
										<Button
											className="bg-gradient-to-br from-[#2A3848] to-[#0A0708] hover:text-gray-3  00"
											onClick={() => {
												signOut();
											}}>
											Logout
										</Button>
									</div>
								) : (
									<>
										<Link href="/sign-in">
											<Button className="">Login</Button>
										</Link>
									</>
								)}
							</div>
						</div>
					</div>
					<div className="block md:hidden  ">
						<Button
							className="flex justify-center items-center bg-gradient-to-br from-[#2A3848] to-[#0A0708] my-2"
							onClick={toggleNav}>
							{isOpen ? <X /> : <Menu />}
						</Button>
					</div>
				</div>
				{isOpen && (
					<div className="md:hidden block h-screen w-screen bg-gradient-to-br from-[#2A3848] to-[#0A0708]">
						<div className="w-full px-10 py-10">
							{info.map((data) => {
								return(
										<Button
											key={data.key}
											className="w-full mb-5 shadow-md">
											<Link
												href={data.link}
												className="flex justify-evenly w-full">
												<span className="text-[#858382] font-semibold">
													{data.title}
												</span>
											</Link>
										</Button>
								);
							})}
							<Button
								className="w-full mb-5 shadow-md text-[#858382] font-semibold"
								onClick={() => {
									signOut();
								}}>
								Logout
							</Button>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}

export default NavBar
