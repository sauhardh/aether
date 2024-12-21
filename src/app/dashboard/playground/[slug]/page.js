"use client"
import { useParams } from "next/navigation"
import { SlCallEnd } from "react-icons/sl";
import { MdFullscreenExit } from "react-icons/md";
import { LuMousePointerClick } from "react-icons/lu";
import { useState, useEffect, useRef } from "react";
import { WebRTC } from "@/lib/webrtc";

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
        console.log("mouse clicked")
    }

    useEffect(() => {
        (async () => {
            await WebRTC();
        })()
    }, [])

    return (
        <div className="w-full min-h-screen flex justify-center items-center">

            <div className={`${fullScreenMode ? "inset-0 left-0 top-0 absolute" : "w-1/2 h-1/2 relative"}`}>
                <div className="p-2 flex flex-col  gap-3 absolute text-white  top-[40%] right-0 mb-5 pb-5 ">
                    <div className="w-[40px] h-[40px] z-1 p-2 rounded-full hover:scale-[0.9]" onClick={handleMousePlay}>
                        <LuMousePointerClick className="w-full h-full" />
                    </div>

                    <div className={`w-[40px] h-[40px] z-1 p-2 rounded-full ${fullScreenMode ? "hover:scale-[0.89]" : "hover:scale-[1.15]"}`} onClick={() => { toggleFullScreen() }}>
                        <MdFullscreenExit className="w-full h-full" />
                    </div>

                    <div className="w-[40px] h-[40px] z-1 p-2 rounded-full bg-red-900 hover:animate-pulse">
                        <SlCallEnd className="w-full h-full" />
                    </div>
                </div>

                <video id="video" ref={videoRef} className="bg-black w-full h-full rounded-lg p-10" autoPlay muted>
                    Your browser does not support this player
                </video>
            </div>

        </div>
    )
}