"use client"
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Card from '@/components/ui/Card';
import { Clock, MapPin } from 'lucide-react';
import { FaMicrochip } from "react-icons/fa6";
import path from 'path';
import { webSocket } from '@/lib/apiClient';


const DashboardPage = () => {
    const { data: session, status } = useSession();

    const [clickedMoreInfo, setClickedMoreInfo] = useState(false);
    const [selectionMethod, setSelectionMethod] = useState("Lowest Rate");
    const [selectedInfo, setSelectedInfo] = useState(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        console.log("sesison", session)
        if (status == "authenticated") {
            handleSelection();
        }
    }, [status])

    function handleCardClick(e) {
        e.preventDefault()
        setClickedMoreInfo(true)
        console.log("Clicked", e.target.closest(".EachCard"))
    }

    const systemInfo = [
        {
            rent: 100,
            system: "Windows",
            version: "10.0.1823",
            machine: "AMD64",
            processor: "Intel64 Family",
            location: "New York, USA"
        },
        {
            rent: 200,
            system: "Windows",
            version: "10.0.1823",
            machine: "AMD64",
            processor: "Intel64 Family",
            location: "Los Angeles, USA"
        },
        {
            rent: 100,
            system: "Linux",
            version: "10.0.1823",
            machine: "AMD64",
            processor: "Intel64 Family",
            location: "London, UK"
        },
        {
            rent: 100,
            system: "Windows",
            version: "10.0.1823",
            machine: "AMD64",
            processor: "Intel64 Family",
            location: "Berlin, Germany"
        },
        {
            rent: 100,
            system: "Linux",
            version: "10.0.1823",
            machine: "AMD64",
            processor: "Intel64 Family",
            location: "Tokyo, Japan"
        },
        {
            rent: 100,
            system: "Windows",
            version: "10.0.1823",
            machine: "AMD64",
            processor: "Intel64 Family",
            location: "Sydney, Australia"
        },
        {
            rent: 100,
            system: "Linux",
            version: "10.0.1823",
            machine: "AMD64",
            processor: "Intel64 Family",
            location: "Mumbai, India"
        },
        {
            rent: 100,
            system: "Linux",
            version: "10.0.1823",
            machine: "AMD64",
            processor: "Intel64 Family",
            location: "Cape Town, South Africa"
        }
    ];

    function handleSelection(type = "rate_asc") {
        let clonedArray = systemInfo.slice();
        let method = "";
        switch (type) {
            case "rate_asc":
                clonedArray.sort((a, b) => a.rent - b.rent)[0]
                method = "Lowest Rate"
                break;
            case "rate_dsc":
                clonedArray.sort((a, b) => b.rent - a.rent)[0]
                method = "Highest Rate"

                break;
            default:
                clonedArray.sort((a, b) => a.rent - b.rent)[0]
                method = "Lowest Rate"
                break;
        }

        setSelectedInfo(clonedArray[0])
        setSelectionMethod(method)
    }



    useEffect(() => {
        (async () => {
            await webSocket()
        })()
    }, [])



    return status == "loading" ? <div>Loading...</div> : (
        <div>
            {systemInfo.length <= 0 && <p className='italic text-gray-500 w-full  bg-tertiary bg-opacity-30 text-center mt-5 p-2 shadow-sm'>No Device is online right now. <b>Please come back later!</b></p>}


            <div className='p-10'>
                <div className='flex justify-between'>
                    <h1 className='font-medium text-medium  text-primary border-b-[8px]  inline-block border-tertiary mb-5 '>Selected Device</h1>
                    <h1 className='font-medium text-medium  text-primary border-b-[8px]  inline-block mb-5 mr-10'>{selectionMethod}</h1>
                </div>

                {!clickedMoreInfo && selectedInfo ?
                    <div className='flex text-primary gap-5 justify-around'>

                        {/* Rent */}
                        <div className=' space-y-10   box-border w-full bg-white p-20 rounded-lg shadow-md'>
                            <div className=' gap-1 text-green-700 text-xl'>
                                <span className='flex'>
                                    <p className=' font-bold text-5xl'>{selectedInfo.rent}</p>
                                    <p className='italic text-sm self-end '>/hr</p>
                                </span>
                                <span className='flex space-x-2 items-baseline'>
                                    <Clock />
                                    <b className='text-primary text-sm '>to rent the device</b>
                                </span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.push(`${pathname}/playground/${session.user.name}`)
                                }}
                                className='border-2 py-3 px-9 rounded-lg font-medium bg-green-700 text-white hover:scale-[0.99]'
                            >
                                Rent now
                            </button>
                        </div>


                        <div className='flex justify-around  gap-x-20 bg-white p-10 rounded-lg shadow-md w-full'>

                            {/* Location */}
                            <div className=' flex-col gap-5 text-medium font-medium  p-10  space-y-10  box-border w-fit rounded-lg self-baseline'>
                                <span className='space-y-5'>
                                    <MapPin width={80} height={40} />
                                    <p>{selectedInfo.location}</p>
                                </span>
                            </div>

                            {/* window */}
                            <div className=' flex-col gap-5 text-medium font-medium  p-10 space-y-10  box-border w-fit'>
                                <span className='flex gap-5'>
                                    <p className='italic'>{selectedInfo.system}</p>
                                    <p className='font-bold text-5xl'>{selectedInfo.version.slice(0, 2)}</p>
                                </span>

                                <span className='flex items-baseline gap-2 pl-12 '>
                                    <FaMicrochip />
                                    <p className='font-bold '>{selectedInfo.machine}</p>
                                </span>
                            </div>
                        </div>

                        {/* TODO */}
                        <div className=' flex-col gap-5 text-medium font-medium  p-10 space-y-10 w-full box-border bg-white rounded-lg shadow-md'>
                            <img
                                src={"./1st_step.jpeg"}
                                alt={"img"}
                                className="w-full rounded-3xl border-8  border-gray-300 shadow-lg hover:shadow-inner"
                            />
                        </div>

                    </div>
                    :
                    null
                }
            </div>

            <div className='p-10'>

                <div className='flex justify-between'>
                    <h1 className='font-medium text-medium  text-primary border-b-[8px]  inline-block border-tertiary mb-5 '>Available Devices</h1>
                    <h1 className='font-medium text-medium  text-primary border-b-[8px]  inline-block mb-5 mr-10'><b>Total:</b> {systemInfo.length}</h1>
                </div>

                <div className="flex h-full flex-wrap gap-9 ">

                    {systemInfo.length > 0 &&
                        <Card systemInfo={systemInfo} handleCardClick={handleCardClick} />
                    }

                </div>
            </div>
        </div >
    );
}

export default DashboardPage;