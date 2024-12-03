"use client"
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Dashboard from '../../components/ui/Dashboard';


const DashboardPage = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (!session || status === "unauthenticated") {
            router.push('/login');
        }
    }, [status, router]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    // if (!session?.user) {
    //     return null;
    // }

    return (
        // <div className='min-h-screen'>
        <Dashboard user={session.user} />
        // </div>
    );
};

export default DashboardPage;