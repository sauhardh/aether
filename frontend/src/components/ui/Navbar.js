"use client"
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import Logout from './Logout';
import Button from '../button';

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <nav
      className="w-full z-50 overflow-clip bg-gray-100
    text-[#2a3439] flex flex-col md:flex-row justify-between items-center 
    p-4 md:py-0 h-auto md:h-[8vh] space-y-2 md:space-y-0 shadow-sm"
    >
      <button
        onClick={() => router.push('/')}
        className='font-bold text-primary text-xl px-4 py-1 cursor-pointer hover:border-b-[6px] transition-all duration-100 border-b-primary hover:py-0'>
        aether
      </button>

      {status === "loading" ? (
        <div className='flex gap-4 mx-8 opacity-50'>
          <span className="text-sm py-2">Checking session...</span>
        </div>
      ) : session ? (
        <div className='flex gap-4 mx-8 items-center'>
          <Button
            placeholder="Lobby"
            direct_to="/lobby"
            path_name="/lobby"
          />

          <Button
            placeholder="Dashboard"
            direct_to="/dashboard"
            path_name="/dashboard"
          />

          <Button
            placeholder="Profile"
            direct_to="/profile"
            path_name="/profile"
          />

          <Button
            placeholder="About us"
            direct_to="/about"
            path_name="/about"
          />

          <Logout img_src={session?.user?.image} />
        </div>
      ) : (
        <div className='flex gap-4 mx-8'>
          <Button
            placeholder="SignUp"
            direct_to="/signup"
            path_name="/signup"
          />
          <Button
            placeholder="Login"
            direct_to="/login"
            path_name="/login"
          />
        </div>
      )}
    </nav>
  );
}
export default Navbar;