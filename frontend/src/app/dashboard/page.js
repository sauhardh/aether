"use client"
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Card from '@/components/ui/Card';
import { Clock, MapPin, Monitor } from 'lucide-react';
import { FaMicrochip } from "react-icons/fa6";
import { webSocket } from '@/lib/apiClient';

const DashboardPage = () => {
    const { data: session, status } = useSession();

    const [clickedMoreInfo, setClickedMoreInfo] = useState(false);
    const [selectionMethod, setSelectionMethod] = useState("Lowest Rate");
    const [selectedInfo, setSelectedInfo] = useState(null);
    const [systemInfo, setSystemInfo] = useState([]);
    const router = useRouter();
    const pathname = usePathname();

    const formatLiveDevice = (device, index) => {
        const info = device.info || {};
        const display = info.display || {};
        const cpuList = info.device?.cpu || [];
        const gpuList = info.device?.gpu || [];
        const cpuName = cpuList[0]?.name && cpuList[0]?.name !== "<>" ? cpuList[0].name : "Host CPU";
        const gpuName = gpuList[0]?.name && gpuList[0]?.name !== "<>" ? gpuList[0].name : "Host GPU";
        
        const resolution = display.width && display.height 
            ? `${display.width}x${display.height}` 
            : "1080p Full HD";

        return {
            id: device.landlord_id || index + 1,
            landlord_id: device.landlord_id || index + 1,
            rent: 100,
            system: "Linux",
            version: `${resolution} (${display.frame_rate || 30}fps)`,
            machine: cpuName,
            processor: gpuName,
            location: info.ip_addr === "0.0.0.0" ? "Local Host" : (info.ip_addr || "Online Host")
        };
    };

    function handleSelection(devicesList = systemInfo, type = "rate_asc") {
        if (!devicesList || devicesList.length === 0) {
            setSelectedInfo(null);
            return;
        }

        let clonedArray = devicesList.slice();
        let method = "";
        switch (type) {
            case "rate_asc":
                clonedArray.sort((a, b) => a.rent - b.rent);
                method = "Lowest Rate";
                break;
            case "rate_dsc":
                clonedArray.sort((a, b) => b.rent - a.rent);
                method = "Highest Rate";
                break;
            default:
                clonedArray.sort((a, b) => a.rent - b.rent);
                method = "Lowest Rate";
                break;
        }

        setSelectedInfo(clonedArray[0]);
        setSelectionMethod(method);
    }

    function handleCardClick(e) {
        e.preventDefault();
        setClickedMoreInfo(true);
    }

    // Connect to WebSocket & receive real-time device updates from Redis
    useEffect(() => {
        if (status === "authenticated" || session) {
            const token = session?.accessToken || null;
            
            webSocket(token, (liveDevices) => {
                if (liveDevices && Array.isArray(liveDevices) && liveDevices.length > 0) {
                    const formatted = liveDevices.map((d, i) => formatLiveDevice(d, i));
                    setSystemInfo(formatted);
                    handleSelection(formatted);
                } else {
                    setSystemInfo([]);
                    setSelectedInfo(null);
                }
            });
        }
    }, [status, session]);

    return status === "loading" ? (
        <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
            Loading your dashboard...
        </div>
    ) : (
        <div className="min-h-screen pb-16">
            {systemInfo.length <= 0 && (
                <div className="mx-10 mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center text-blue-900 shadow-sm">
                    <p className="font-semibold text-lg">No Live Devices Connected Right Now</p>
                    <p className="text-sm text-blue-700 mt-1">
                        To share your computer screen: Start your Rust agent (<code className="bg-blue-100 px-2 py-0.5 rounded">cargo run</code> in <code className="bg-blue-100 px-2 py-0.5 rounded">the-oxidized-landlord</code>) and submit port <b>8000</b> in the <b>Lobby</b>!
                    </p>
                </div>
            )}

            {selectedInfo && (
                <div className='p-10'>
                    <div className='flex justify-between'>
                        <h1 className='font-medium text-xl text-primary border-b-[8px] inline-block border-tertiary mb-5'>
                            Featured Live Device
                        </h1>
                        <h1 className='font-medium text-lg text-primary border-b-[8px] inline-block mb-5 mr-10'>
                            {selectionMethod}
                        </h1>
                    </div>

                    {!clickedMoreInfo && (
                        <div className='flex flex-col lg:flex-row text-primary gap-6 justify-around'>
                            {/* Rent Box */}
                            <div className='space-y-6 box-border w-full lg:w-1/3 bg-white p-8 rounded-2xl shadow-md flex flex-col justify-between'>
                                <div className='gap-1 text-green-700 text-xl'>
                                    <span className='flex items-baseline'>
                                        <p className='font-bold text-5xl'>${selectedInfo.rent}</p>
                                        <p className='italic text-sm ml-1'>/hr</p>
                                    </span>
                                    <span className='flex space-x-2 items-center mt-2'>
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <b className='text-gray-600 text-sm'>Live Compute Stream</b>
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const userName = session?.user?.name || "guest";
                                        router.push(`${pathname}/playground/${userName}`);
                                    }}
                                    className='w-full py-3 px-6 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 active:scale-[0.98] transition-all shadow-md'
                                >
                                    Connect & Stream Now
                                </button>
                            </div>

                            {/* Specs Info */}
                            <div className='flex justify-around gap-x-10 bg-white p-8 rounded-2xl shadow-md w-full lg:w-2/3'>
                                <div className='flex flex-col gap-3 justify-center'>
                                    <span className='flex items-center space-x-3 text-gray-700'>
                                        <MapPin className="w-6 h-6 text-blue-600" />
                                        <p className="font-medium text-lg">{selectedInfo.location}</p>
                                    </span>
                                    <span className='flex items-center space-x-3 text-gray-700'>
                                        <Monitor className="w-6 h-6 text-purple-600" />
                                        <p className="font-medium">{selectedInfo.version}</p>
                                    </span>
                                </div>

                                <div className='flex flex-col gap-3 justify-center border-l pl-8'>
                                    <span className='flex items-center space-x-3 text-gray-700'>
                                        <FaMicrochip className="w-6 h-6 text-teal-600" />
                                        <p className='font-medium'>{selectedInfo.machine}</p>
                                    </span>
                                    <span className='text-sm text-gray-500'>
                                        GPU: {selectedInfo.processor}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className='p-10'>
                <div className='flex justify-between items-center mb-6'>
                    <h1 className='font-medium text-2xl text-primary border-b-[8px] inline-block border-tertiary'>
                        Available Online Devices
                    </h1>
                    <span className='text-lg font-semibold text-gray-600 bg-white px-4 py-2 rounded-xl shadow-sm border'>
                        Online Hosts: <b>{systemInfo.length}</b>
                    </span>
                </div>

                <div className="flex h-full flex-wrap gap-8">
                    {systemInfo.length > 0 ? (
                        <Card systemInfo={systemInfo} handleCardClick={handleCardClick} />
                    ) : (
                        <div className="w-full text-center py-16 bg-white border border-dashed border-gray-300 rounded-2xl">
                            <p className="text-gray-500 text-lg">Waiting for host computers to publish specifications...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;