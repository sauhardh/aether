'use client'
import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'



const Logout = () => {
    const router = useRouter()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const handleLogout = async () => {
        if (!isMounted) return // Prevent navigation if the component is not mounted

        try {
            await signOut({ redirect: false })
            // Clear user session or token if any
            localStorage.removeItem('userToken')
            // Redirect to login page
            router.push('/login')
        } catch (error) {
            console.error('Failed to log out:', error)
        }
    }

    if (!isMounted) return null // Avoid rendering on the server

    return (
        <button
            className="text-white font-bold px-4 py-2 bg-red-500 rounded hover:bg-red-600"
            onClick={handleLogout}
        >
            Logout
        </button>
    )
}

export default Logout