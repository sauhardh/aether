"use client"
import { useParams } from "next/navigation"
import { SlCallEnd } from "react-icons/sl";
import { MdFullscreenExit } from "react-icons/md";
import { LuMousePointerClick } from "react-icons/lu";
import { useState, useEffect, useRef } from "react";
import { WebRTC } from "@/lib/webrtc";
import { ws_handleMouseControl, ws_disconnectConnection } from "@/lib/apiClient";



export default function Page() {
    const params = useParams()
    const [fullScreenMode, setFullScreenMode] = useState(false);
    const videoRef = useRef(null);

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            setFullScreenMode(true)
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            setFullScreenMode(false)
            document.exitFullscreen();
        }
    }

    async function handleMousePlay() {
        console.log("mouse clicked on mouse")
        await ws_handleMouseControl()
    }

    async function handleEndCall() {
        console.log("mouse clicked on end call")
        await ws_disconnectConnection()
    }

    useEffect(() => {
        (async () => {
            await WebRTC(videoRef);
        })()
    }, [])

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-gray-900 p-6">
            <div className={`${fullScreenMode ? "fixed inset-0 z-50 w-screen h-screen bg-black" : "w-full max-w-5xl h-[75vh] relative flex justify-center items-center"}`}>
                <div className="p-2 flex flex-col gap-3 absolute text-white top-[40%] right-4 z-20 mb-5 pb-5 bg-black/50 backdrop-blur rounded-2xl">
                    <div className="w-[40px] h-[40px] z-1 p-2 rounded-full hover:scale-[0.9] cursor-pointer" onClick={handleMousePlay}>
                        <LuMousePointerClick className="w-full h-full" />
                    </div>

                    <div className={`w-[40px] h-[40px] z-1 p-2 rounded-full cursor-pointer ${fullScreenMode ? "hover:scale-[0.89]" : "hover:scale-[1.15]"}`} onClick={() => { toggleFullScreen() }}>
                        <MdFullscreenExit className="w-full h-full" />
                    </div>

                    <div className="w-[40px] h-[40px] z-1 p-2 rounded-full bg-red-900 hover:animate-pulse cursor-pointer" onClick={handleEndCall}>
                        <SlCallEnd className="w-full h-full" />
                    </div>
                </div>

                <video
                    id="video"
                    ref={videoRef}
                    className="w-full h-full rounded-2xl bg-black object-contain shadow-2xl border border-gray-800"
                    autoPlay
                    playsInline
                    muted
                >
                    Your browser does not support this player
                </video>
            </div>
        </div>
    )
}