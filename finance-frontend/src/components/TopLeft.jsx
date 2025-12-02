import React, { useState, useEffect } from "react";
import axios from "axios";


const TopLeft = () => {

    const [todays,setTodays] = useState(null);
    const [years,setYear] = useState(null);
    const [months,setMonth] = useState(null);
    const [error, setError] = useState("");

    const fetchCalc = async () => {
        try {
            
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/ecalc`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

      );
        console.log(response.data);
        setTodays(response.data.todays);
        setMonth(response.data.months);
        setYear(response.data.years);
      
    }
    
    catch (err) {
      console.error("Error fetching insights data:", err);
      setError("Failed to load insights");

    }}

    useEffect(() => {
        fetchCalc();
    }, []);

    return (

        <div className="h-1/4 w-full flex flex-col bg-[#121212] border border-[#ffffff2d] shadow-md rounded-xl px-4 py-3">
        <div className="grid grid-cols-3 gap-4 h-full divide-x divide-[#ffffff2d]">

            <div className="grid grid-cols-1 h-full">
            <div className="flex justify-center items-center h-full text-center text-1xl sm:text-1xl md:text-1xl lg:text-3xl xl:text-4xl font-anton font-extrabold text-white">
                TODAY 
            </div>
            <div className="flex justify-center h-full text-center text-1xl sm:text-1xl md:text-1xl lg:text-3xl xl:text-4xl font-anton font-extrabold text-[#2bee55]">
                ₹{todays}
            </div>
            </div>

            <div className="grid grid-cols-1 h-full">
            <div className="flex justify-center h-full items-center text-center text-1xl sm:text-1xl md:text-1xl lg:text-3xl xl:text-4xl font-anton font-extrabold text-white">
                THIS MONTH 
            </div>
            <div className="flex justify-center h-full text-center text-1xl sm:text-1xl md:text-1xl lg:text-3xl xl:text-4xl font-anton font-extrabold text-[#2bee55]">
                ₹{months}
            </div>
            </div>

            <div className="grid grid-cols-1 h-full">
            <div className="flex justify-center h-full items-center text-center text-1xl sm:text-1xl md:text-1xl lg:text-3xl xl:text-4xl font-anton font-extrabold text-white">
                THIS YEAR 
            </div>
            <div className="flex justify-center h-full text-center text-1xl sm:text-1xl md:text-1xl lg:text-3xl xl:text-4xl font-anton font-extrabold text-[#2bee55]">
                ₹{years}
            </div>
            </div>
            
        </div>
        </div>
    );
}

export default TopLeft;