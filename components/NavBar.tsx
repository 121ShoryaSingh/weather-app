'use client';
import React, { useState } from 'react';
import Logo from './Logo';
import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { id: 1, title: 'DASHBOARD', link: '/dashboard', icon: '/home.svg' },
  { id: 2, title: 'SAVED LOCATION', link: '/savedlocation', icon: '/location.svg' },
];

const NavBar = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="max-w-screen-xl w-full mx-auto py-2">
      <div className="flex justify-between items-center px-6">
        {/* Logo */}
        <Link href="/dashboard">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {/* Show links only if user is authenticated */}
          {session &&
            navLinks.map((item) => (
              <Link key={item.id} href={item.link} className="flex items-center gap-2 text-gray-600 hover:text-black transition">
                <Image src={item.icon} alt={item.title} width={20} height={20} />
                <span className="font-semibold">{item.title}</span>
              </Link>
            ))}

          {/* Auth Buttons */}
          {session ? (
            <div className="flex items-center gap-3">
              <span className="font-bold">Welcome, {user?.name || 'Guest'}</span>
              <Button onClick={() => signOut()} className="bg-gradient-to-br from-gray-800 to-black">
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/sign-in">
              <Button>Login</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <Button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-90 text-white flex flex-col items-center justify-center space-y-6">
          {/* Show links only if user is authenticated */}
          {session &&
            navLinks.map((item) => (
              <Link key={item.id} href={item.link} className="text-xl font-semibold" onClick={() => setIsOpen(false)}>
                {item.title}
              </Link>
            ))}
          {session ? (
            <Button className="text-white bg-red-600" onClick={() => signOut()}>
              Logout
            </Button>
          ) : (
            <Link href="/sign-in">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
