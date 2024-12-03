'use client'
import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Divide } from 'lucide-react'
import Image from 'next/image'



const Logout = ({ img_src = "" }) => {
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
        <div className='flex cursor-pointer hover:border-b-[6px] transition-all duration-100  border-b-primary hover:py-0'>
            {img_src &&
                <Image
                    src={`${img_src}`}
                    alt=""
                    width={40}
                    height={20}
                    className='rounded-full p-2'
                />
            }

            <button
                className="font-medium px-2 pl-0 py-2 "
                onClick={handleLogout}
            >
                Logout
            </button>
        </div >

    )
}

export default Logout