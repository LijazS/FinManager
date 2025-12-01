import React, { useEffect } from "react";
import Header from "../components/Header.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TopLeft from "../components/TopLeft.jsx";
import Chat from "../components/Chat.jsx";
import Insights from "../components/Insights.jsx";


const Dashboard = () => {

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
            } catch (error) {
                console.error("Error fetching dashboard data:", error.response.data);
                console.log("Redirecting to Front Page");
                navigate("/");
            }
        };

        fetchData();
    }, []);

    return(
    <div className="w-full h-screen bg-gray-900 text-white flex flex-col pt-20">
      <div className="w-full">
        <Header />
      </div>
       <div className="flex-1 p-4 pt-6 bg-[#121212] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
            
                {/* <!-- Left Column --> */}
                <div className="flex flex-col gap-4 col-span-2 h-full min-h-0">
                <div className="bg-[#121212] rounded-lg shadow p-4 h-1/4">
                    <TopLeft />
                </div>
                
                    <Chat />
                
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-4 col-span-2 h-full">
                
                    {/* Top block */}
                    <Insights />
                
                <div className="bg-[#121212] rounded-lg shadow p-4 h-1/2">
                    {/* Bottom block */}
                    Bottom Right
                </div>
                </div>

            </div>
        </div>
    </div>
    )

}

export default Dashboard;