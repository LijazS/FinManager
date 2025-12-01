import React, { useEffect, useState } from "react";
import axios from "axios";

const Insights = () => {
  const [insights, setInsights] = useState("");
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
      const firstBreak = raw.indexOf("\n\n");
      const cleaned =
        firstBreak !== -1 ? raw.slice(firstBreak + 2).trimStart() : raw;

      setInsights(cleaned);
    } catch (err) {
      console.error("Error fetching insights data:", err);
      setError("Failed to load insights");
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);



  return (
         <div className="h-1/2">
      {/* Card fills the available height inside the gray parent */}
      <div className="h-full w-full flex flex-col bg-[#121212] border border-[#ffffff2d] shadow-md rounded-xl px-4 py-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-50 mb-3">
          Spending Insights
        </h2>

        {error && (
          <p className="text-sm text-red-500 mb-2">
            {error}
          </p>
        )}

        {/* Content area expands and scrolls if needed */}
        <div className="flex-1 overflow-y-auto">
          {!insights ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              No insights yet. Add some expenses and refresh the page to see
              your spending analysis.
            </p>
          ) : (
            <div className="text-sm sm:text-base text-left text-gray-800 dark:text-gray-100 space-y-1">
              {insights
                .split("\n")
                .filter((line) => line.trim().length > 0)
                .map((line, idx) => {
                  const trimmed = line.trim();
                  const headingMatch = trimmed.match(/^\*\*(.+)\*\*:?$/);

                  if (headingMatch) {
                    return (
                      <h3
                        key={idx}
                        className="mt-3 font-semibold text-gray-900 dark:text-gray-50"
                      >
                        {headingMatch[1]}
                      </h3>
                    );
                  }

                  if (trimmed.startsWith("- ")) {
                    return (
                      <p key={idx} className="flex items-start gap-2 pl-3">
                        <span className="mt-1 text-xs">•</span>
                        <span>{trimmed.slice(2)}</span>
                      </p>
                    );
                  }

                  return <p key={idx}>{trimmed}</p>;
                })}
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default Insights;
