"use client"
import React from 'react'
import "@/app/globals.css"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const page = () => {
  const { data: session } = useSession()
  if (session) {
    
    console.log("There is session")
    console.log("session", session.user?.email)
  }
  return (
    <div className='text-black min-h-screen text-center'>
       <h1>
       Hello This is about page
        </h1> 
    </div>
  )
}

export default page