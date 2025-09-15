import React, { useState, useEffect } from "react";
import './balance.css';

const Bal = () => {
  // ✅ Store state for overallTotal
  const [overallTotal, setOverallTotal] = useState(
    localStorage.getItem("overallTotal") || 0
  );

  // ✅ Listen for custom "storageChanged" event
  useEffect(() => {
    const handleChange = () => {
      const total = localStorage.getItem("overallTotal");
      setOverallTotal(total);
    };

    window.addEventListener("storageChanged", handleChange);
    return () => window.removeEventListener("storageChanged", handleChange);
  }, []);

  return (
    <div className="finmate-card">
      <div className="finmate-card-balance">
        {/* <p className="finmate-card-label">Available Balance</p> */}
        <p className="finmate-card-amount">Total</p>
      </div>
      <div className="finmate-card-summary">
        {/* <div>
          <p className="finmate-card-label">Income</p>
          <p className="finmate-card-green">+ ₹20,000</p>
        </div> */}
        <div>
          <p className="finmate-card-label">Expenses</p>
          <p className="finmate-card-red">₹{overallTotal}</p>
        </div>
      </div>
    </div>
  );
};



export default Bal;
