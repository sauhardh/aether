"use client"
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import Logout from './Logout';

const Navbar = () => {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      // Calculate when we've scrolled past 70vh (hero section height)
      const heroHeight = window.innerHeight * 0.7;
      setIsScrolled(window.scrollY >= heroHeight);
    };

    if (isHomePage) {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage]);

  const navbarClasses = `
    fixed top-0 w-full z-50 
    transition-colors duration-300 
    ${isHomePage && !isScrolled ? 'bg-transparent backdrop-blur-sm' : 'bg-slate-950'} 
    text-white flex flex-col md:flex-row justify-between items-center 
    px-4 py-2 md:py-0 h-auto md:h-[8vh] space-y-2 md:space-y-0
  `;

  return (
    <nav className={navbarClasses}>
      <button onClick={() => router.push('/')}>Aether</button>
      {session ? (
        <Logout />
      ) : (
        <div className='flex gap-4 mx-8'>
          <button
            // className={`font-medium text-xl px-4 py-2 ${isHomePage && !isScrolled ? 'bg-[#368985] hover:bg-[#3182ce] text-[#f4f4f4]' : ''} rounded-md hover:bg-[#3182ce]`}
            className={`font-medium text-xl px-4 py-2  rounded-md hover:underline`}
            onClick={() => router.push('/signup')}
          >
            SignUp
          </button>
          <button
            // className={`font-medium text-xl px-4 py-2 ${isHomePage && !isScrolled ? 'bg-[#318883] hover:bg-[#3182ce] text-[#f4f4f4]' : ''} rounded-md hover:bg-[#3182ce]`}
            className={`font-medium text-xl px-4 py-2  rounded-md hover:underline`}


            onClick={() => router.push('/login')}
          >
            Login
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;