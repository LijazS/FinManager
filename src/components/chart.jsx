import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config";
import "./chart.css"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];


const Chart = () => {
  const [chartData, setChartData] = useState([]);
  const userId = JSON.parse(localStorage.getItem("auth"))?.userID;

  const [chartFilter, setChartFilter] = useState(() => {
  return JSON.parse(localStorage.getItem("chartFilter")) || {
    type: "month",
    value: monthNames[new Date().getMonth()],
  };
});



////////////////////////////////////   FETCHING EXPENSES AND SORTING ////////////////////////

    const fetchExpenses = async (filter) => {
      try {
        const expensesRef = collection(db, "users", userId, "expenses");
        const snapshot = await getDocs(expensesRef);

        const dailyTotals = {};
        const monthlyTotals = {};

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonthIndex = today.getMonth();

        snapshot.forEach((doc) => {
          const data = doc.data();
          const rawDate = new Date(data.date);
          if (isNaN(rawDate)) return;

          const year = rawDate.getFullYear();
          const month = rawDate.getMonth();
          const day = rawDate.getDate();
          const monthKey = monthNames[month];

          const amount = Number(data.amount) || 0;

          // Handling Month Filter (daily totals)
          if (filter.type === "month") {
  let selectedMonth;

  if (filter.value === "This Month") {
    selectedMonth = currentMonthIndex;
  } else {
    selectedMonth = monthNames.indexOf(filter.value);
  }

  // Only continue if selectedMonth is a valid index (0-11)
  if (selectedMonth !== -1 && year === currentYear && month === selectedMonth) {
    const dayKey = day.toString().padStart(2, "0");
    dailyTotals[dayKey] = (dailyTotals[dayKey] || 0) + amount;
  }
}


          // Handling Year Filter (monthly totals)
          else if (filter.type === "year") {
            const yearsBack = {
              "This Year": 0,
              "Last 2 Years": 1,
              "Last 3 Years": 2,
              "Lifetime": 100,
            }[filter.value];

            if (year >= currentYear - yearsBack) {
              monthlyTotals[`${monthKey} ${year}`] = (monthlyTotals[`${monthKey} ${year}`] || 0) + amount;
            }
          }
        });

        // Final chart data format
        if (filter.type === "month") {
          const dataForChart = Object.entries(dailyTotals)
            .map(([day, total]) => ({ day, total: parseFloat(total.toFixed(2)) }))
            .sort((a, b) => Number(a.day) - Number(b.day));
          setChartData(dataForChart);
        } else if (filter.type === "year") {
          const dataForChart = Object.entries(monthlyTotals)
            .map(([label, total]) => ({ label, total: parseFloat(total.toFixed(2)) }))
            .sort((a, b) => {
              const [monthA, yearA] = a.label.split(" ");
              const [monthB, yearB] = b.label.split(" ");
              return new Date(`${monthA} 1, ${yearA}`) - new Date(`${monthB} 1, ${yearB}`);
            });
          setChartData(dataForChart);
        }

      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

///////////////////////////////////////////////////////////////////   

useEffect(() => {
  const storedFilter = JSON.parse(localStorage.getItem("chartFilter"));
  if (storedFilter) {
    setChartFilter(storedFilter);
  }

  const handleFilterChange = (e) => {
    const newFilter = e.detail; // from CustomEvent
    setChartFilter(newFilter);
    
    console.log("Chart filter updated via custom event:", newFilter);
  };

  window.addEventListener("chartFilterUpdated", handleFilterChange);

  return () => {
    window.removeEventListener("chartFilterUpdated", handleFilterChange);
  };
}, []);

  /////////////////////////////////////////////////////////////////


 useEffect(() => {
    if (!userId || !chartFilter) return;

    const filter = JSON.parse(localStorage.getItem("chartFilter")) || {
      type: "month",
      value: monthNames[new Date().getMonth()],
    };

    fetchExpenses(chartFilter);

    // Optional: also refetch when localStorage changes
    const handleStorage = () => fetchExpenses(chartFilter);
    window.addEventListener("chartFilterUpdated", handleStorage);
    return () => window.removeEventListener("chartFilterUpdated", handleStorage);

  }, [userId,chartFilter]);
////////////////////////////////////////////////////////////////////////////

  return (
    <div className="chart-container">
     <h3 className="chart-title">Daily Expenses for {chartFilter?.value || "Current Month"}</h3>

      <ResponsiveContainer width="130%" height={200}>
        <LineChart data={chartData}>
          
          <CartesianGrid stroke="#000000" />

          
          <XAxis
  dataKey={chartFilter?.type === "year" ? "label" : "day"}
  stroke="#000"
  tick={{ fill: '#000' }}
  label={{
    value: chartFilter?.type === "year" ? "Month-Year" : "Day",
    position: "insideBottomRight",
    offset: -5
  }}
/>

          
          <YAxis  stroke="#00000"
      tick={{ fill: '#00000' }}
      label={{ value: "", 
          position: "insideBottomLeft", style: { fill: '#000000', fontWeight: 'bold', fontSize: 14 }, 
          offset: 10 }}
      tickLine={false}/>

          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#dd0000" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
