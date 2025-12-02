import React, { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TopLeft from "../components/TopLeft.jsx";
import Chat from "../components/Chat.jsx";
import Insights from "../components/Insights.jsx";
import Suggestions from "../components/Suggestions.jsx";


const Dashboard = () => {

    const [insights, setInsights] = useState("");
    const [suggestions, setSuggestions] = useState("")
    const [error, setError] = useState("");

  const fetchInsights = async () => {
    try {
      setError("");
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/insights`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Insights data:", response.data);

      const raw = response.data.insights || "";
      // Optional: remove first paragraph (intro line)
      const insightsStart = raw.indexOf("**Spending Insights**");
      const suggestionsStart = raw.indexOf("**Spending Suggestions**");

      let insightsSection = "";
        let suggestionsSection = "";

        if (insightsStart !== -1 && suggestionsStart !== -1) {
        insightsSection = raw
            .slice(insightsStart, suggestionsStart)  // from Insights heading up to Suggestions heading
            .trim();

        suggestionsSection = raw
            .slice(suggestionsStart)                // from Suggestions heading to the end
            .trim();
        } else {
        // Fallback: if headings missing, just treat whole thing as insights
        insightsSection = raw.trim();
        }

        const cleanedInsights = insightsSection.split("\n").slice(1).join("\n");
        const cleanedSuggestions = suggestionsSection.split("\n").slice(1).join("\n");

      

      setInsights(cleanedInsights);
      setSuggestions(cleanedSuggestions)
    } catch (err) {
      console.error("Error fetching insights data:", err);
      setError("Failed to load insights");
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

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
                <div className="flex flex-col gap-4 col-span-2 h-full">
                
                    <TopLeft />
                
                
                    <Chat />
                
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-4 col-span-2 h-full">
                
                    {/* Top block */}
                    <Insights insights={insights} error={error} fetchInsights={fetchInsights}/>
                
                
                    {/* Bottom block */}
                    <Suggestions suggestions={suggestions} error={error} />
                
                </div>

            </div>
        </div>
    </div>
    )

}

export default Dashboard;