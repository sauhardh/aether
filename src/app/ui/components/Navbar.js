"use client"
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  // useEffect(() => {
  //   const handleScroll = () => {
  //     // Calculate when we've scrolled past 70vh (hero section height)
  //     const heroHeight = window.innerHeight * 0.7;
  //     setIsScrolled(window.scrollY >= heroHeight);
  //   };

  //   if (isHomePage) {
  //     window.addEventListener('scroll', handleScroll);
  //   }

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, [isHomePage]);


  return (
    <nav className="
    fixed  w-full z-50  
    bg-slate-950
    text-white flex flex-col md:flex-row justify-between items-center 
    px-4 py-2 md:py-0 h-auto md:h-[8vh] space-y-2 md:space-y-0
  ">
      This is Navbar
    </nav >
  );
}

export default Navbar;