"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { GET_identification, POST_locallandlord } from "@/lib/apiClient";

export default function Lobby() {
    const router = useRouter();
    const [landlordClicked, setLandlordClicked] = useState(false);
    const [port, setPort] = useState(6969);
    const [token, setToken] = useState(null);
    const [messageToClient, setmessageToClient] = useState("");
    const [submissionClicked, setSubmissionClicked] = useState(false);

    function handleLandlordClick() {
        console.log("Clicked on landlord");
        setLandlordClicked(true);
    }

    function handleBack() {
        setLandlordClicked(false);
    }
    async function handlePortSubmission(e) {
        setSubmissionClicked(true)
        if (!port) {
            console.log("__PORT IS EMPTY")
            return;
        }
        const token = await GET_identification();

        if (token)
            setToken(token);

        await POST_locallandlord(port, token)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-500 via-gray-700 to-gray-800 text-gray-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-particles opacity-50"></div>

            <div className="relative z-10 max-w-5xl w-full bg-opacity-70 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
                {landlordClicked && (
                    <div
                        className="bg-gray-900 inline-block p-2 rounded-full hover:scale-[0.95]"
                        onClick={(e) => {
                            e.preventDefault();
                            handleBack();
                        }}
                    >
                        <ArrowRight className="font-extrabold rotate-180 text-3xl" />
                    </div>
                )}

                <div className="text-center mb-12 space-x-2">
                    <h1 className="text-4xl font-bold animate-fadeIn inline-block border-b-[8px] border-tertiary">
                        Select your role
                    </h1>
                    {
                        landlordClicked ? (
                            <h1 className="text-4xl font-bold animate-fadeIn inline-block">
                                : Landlord
                            </h1>
                        ) :
                            <p className="mt-4 text-gray-300 text-lg">
                                Whether you're looking to <b>rent a device</b> or <b>offer yours</b>, we've got you covered.
                            </p>
                    }
                </div>

                {/* Role Cards */}
                {!landlordClicked ? (
                    <div className="flex gap-10 w-full">

                        {/* Tenant*/}
                        <div className="w-full bg-gray-800 rounded-2xl p-8 hover:shadow-[0_15px_40px_rgba(64,224,208,0.5)] transition-shadow transform hover:-translate-y-2">
                            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                                <svg
                                    className={`w-20 h-20 text-teal-400 group-hover:animate-spin`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm0 18a8 8 0 118-8 8.009 8.009 0 01-8 8zM8.294 8.706a1 1 0 011.415 0L12 10.993l2.294-2.294a1 1 0 111.415 1.415L13.414 12l2.294 2.294a1 1 0 01-1.415 1.415L12 13.414l-2.294 2.294a1 1 0 01-1.415-1.415L10.586 12 8.294 9.706a1 1 0 010-1.415z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-teal-400 text-center mt-12">
                                Be a Tenant
                            </h2>
                            <p className="text-gray-400 text-center mt-4">
                                Rent high-performance devices for gaming, work, or personal use at your convenience.
                            </p>
                            <button
                                className="w-full mt-6 py-3 bg-teal-500 text-gray-900 rounded-lg font-medium hover:bg-teal-400 transition-all"
                                onClick={() => {
                                    router.push("/dashboard");
                                }}
                            >
                                Get Started
                            </button>
                        </div>

                        {/* Landlord Role */}
                        <div className="w-full bg-gray-800 rounded-2xl p-8 hover:shadow-[0_15px_40px_rgba(0,0,255,0.5)] transition-shadow transform hover:-translate-y-2">
                            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                                <svg
                                    className="w-20 h-20 text-blue-400 group-hover:animate-bounce"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm0 18a8 8 0 118-8 8.009 8.009 0 01-8 8zM15.293 9.293a1 1 0 010 1.414L13.414 12l1.879 1.879a1 1 0 01-1.415 1.414L12 13.414l-1.879 1.879a1 1 0 01-1.415-1.414L10.586 12 8.707 10.121a1 1 0 011.415-1.414L12 10.586l1.879-1.879a1 1 0 011.414 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-blue-400 text-center mt-12">
                                Be a Landlord
                            </h2>
                            <p className="text-gray-400 text-center mt-4">
                                Share your resources and earn money by providing devices to others securely.
                            </p>
                            <button
                                className="w-full mt-6 py-3 bg-blue-500 text-gray-900 rounded-lg font-medium hover:bg-blue-400 transition-all"
                                onClick={handleLandlordClick}
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                ) : (
                    /**
                     * 
                     * Landlord Details Form
                     */
                    <div className="mt-8 text-gray-100 px-10">

                        <p className="text-gray-300 text-center mb-6 bg-tertiary bg-opacity-30 p-2">
                            Please ensure that <Link target="blank" href="https://github.com/the-aether-project/the-oxidized-landlord" alt="Link to landlord code" className="font-bold border-b-4 text-primary border-tertiary">Landlord Code</Link> is installed on your device.
                        </p>

                        {
                            submissionClicked &&
                            <div className="text-gray-300 text-center  bg-tertiary bg-opacity-30 p-2">
                                <p className="">
                                    {token == null ? <i className={`border-b-2 font-bold  border-tertiary ${token == null ? "animate-pulse" : ""}`}>Getting things ready...</i> : "You are ready from this side."}
                                </p>
                                <p className="text-[10px] text-primary overflow-hidden">
                                    {token != null && token.slice(1, token.length - 50)}
                                </p>
                            </div>
                        }

                        <div className="flex gap-20">

                            <div className="w-1/2">
                                <div className="space-y-4 w-full">
                                    <div className="">
                                        <label htmlFor="port" className="block text-gray-300 font-bold">
                                            Port Number:
                                        </label>
                                        <input
                                            type="number"
                                            maxLength={4}
                                            id="port"
                                            value={port}
                                            onChange={(e) => setPort(e.target.value)}
                                            className={`w-full font-bold px-4 py-3 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${port ? "" : "border-2 border-red-400"}`}
                                        />
                                    </div>
                                </div>
                                <button
                                    className="w-full mt-6 py-3 bg-blue-500 text-gray-900 rounded-lg font-medium hover:bg-blue-400 transition-all "
                                    onClick={handlePortSubmission}
                                >
                                    Submit Details
                                </button>
                            </div>


                            <div className="w-1/2 pt-6 self-start">
                                <p className="font-bold">Note:</p>
                                <p className="text-gray-300">
                                    Enter the port number where landlord is listening on.
                                    If you have not changed any on landlord, let it be default and continue.
                                </p>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div >
    );
}
