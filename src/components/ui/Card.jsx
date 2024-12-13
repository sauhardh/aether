import React from 'react'
import { useEffect, useState } from 'react';
import { FcLinux } from "react-icons/fc";
import { FaWindows } from "react-icons/fa";
import { MdComputer } from "react-icons/md";

function Card({ systemInfo, handleCardClick }) {
    return (
        <div className="flex h-full flex-wrap gap-9 ">

            {systemInfo.map((each, index) =>
                < div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl shadow-md p-4 w-72 cursor-pointer
                                transition-all duration-300
                                hover:shadow-lg hover:border-blue-200
                                active:scale-[0.98] group EachCard"
                    onClick={handleCardClick}
                >

                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            <MdComputer className="w-5 h-5  opacity-60 group-hover:opacity-100 transition-opacity" />
                            <h3 className="text-sm font-semibold text-primary hover:border-b-2 ">{each.location.length > 10 ?
                                `${each.location.slice(0, 10)}...` :
                                each.location}
                            </h3>
                        </div>
                        <span className="text-medium font-bold  text-green-700 flex">${each.rent}<p className='text-xs self-end'>/hr</p></span>
                    </div>

                    <div>
                        {Object.entries(each).map(([key, value]) =>
                            key != "rent" && key != "location" ?
                                <div
                                    key={key}
                                    className="flex justify-between items-center p-2 space-y-2
                            bg-gray-50 rounded-md 
                            group-hover:bg-blue-50 transition-colors"
                                >
                                    <span className="text-xs text-gray-600 capitalize">{key}</span>
                                    <span className={`text-xs font-medium text-primary ${key == "version" ? "italic" : ""}`}>
                                        {value == "Windows" ? <FaWindows />
                                            : value == "Linux" ? <FcLinux />
                                                : value
                                        }
                                    </span>
                                </div>
                                :
                                null
                        )}
                    </div>
                </div>
            )
            }
        </div >
    )
}

export default Card