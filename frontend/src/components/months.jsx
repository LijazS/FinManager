import React, { useState, useEffect } from "react";
import './balance.css';

const Mon = () => {
  // ✅ Store state for overallTotal
  const [monthlyTotal, setMonthlyTotal] = useState(
    localStorage.getItem("monthlyTotal") || 0
  );

  // ✅ Listen for custom "storageChanged" event
  useEffect(() => {
    const handleChange = () => {
      const total = localStorage.getItem("monthlyTotal");
      setMonthlyTotal(total);
    };

    window.addEventListener("storageChanged", handleChange);
    return () => window.removeEventListener("storageChanged", handleChange);
  }, []);

  return (
    <div className="finmate-card">
      <div className="finmate-card-balance">
        {/* <p className="finmate-card-label"></p> */}
        <p className="finmate-card-amount">This Month</p>
      </div>
      <div className="finmate-card-summary">
        {/* <div>
          <p className="finmate-card-label">Income</p>
          <p className="finmate-card-green">+ ₹20,000</p>
        </div> */}
        <div>
          <p className="finmate-card-label">Expenses</p>
          <p className="finmate-card-red">₹{monthlyTotal}</p>
        </div>
      </div>
    </div>
  );
};



export default Mon;
