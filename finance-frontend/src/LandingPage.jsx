import React from "react";
import Header from "./components/Header.jsx";
import axios from "axios";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";


const LandingPage = () => {

  
    const navigate = useNavigate();
    
    useEffect(() => {
        // Example API call to fetch dashboard data
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/protected`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Dashboard data:", response.data);
                if(response.data.accessFlag){
                navigate("/dashboard");
            }
            } catch (error) {
                console.error("Error fetching dashboard data:", error.response.data);
                console.log("Redirecting to Front Page");
            }
            
        };

        fetchData();
    }, []);

    

    return (
        <div className="w-full h-screen pt-12 left-0 right-0 bg-gray-900 text-white relative pt-20">
      <div className="w-full">
        <Header />
      </div>
        <div className="flex-1 p-4 pt-6 overflow-y-auto md:px-8 justify-center items-center text-center h-full flex flex-col">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to FinAgent</h1>
            <h7 className="text-2xl md:text-1xl mb-6 text-gray-600">Please log in or sign up to continue.</h7>
        </div>
        </div>
    );
}

export default LandingPage;