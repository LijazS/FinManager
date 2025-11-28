import React, { useState, useEffect } from "react";
import "./calendar.css";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config";

const Calendar = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [expenses, setExpenses] = useState({});
  const [input, setInput] = useState("");

  const userId = JSON.parse(localStorage.getItem("auth"))?.userID;

  ///  MONTHLY TOTAL ///
  const getMonthlyTotal = () => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-based

  return Object.entries(expenses).reduce((sum, [dateStr, data]) => {
    const dateObj = new Date(dateStr);
    if (
      dateObj.getFullYear() === year &&
      dateObj.getMonth() === month
    ) {
      return sum + data.total;
    }
    return sum;
  }, 0);
};


  // Helper function to safely format dates as YYYY-MM-DD
  const formatDate = (dateObj) => {
    if (!(dateObj instanceof Date) || isNaN(dateObj)) return "";
    return dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  // Fetch expenses on mount
  useEffect(() => {
    if (!userId) return;
    fetchUserExpenses(userId).then(setExpenses).catch(console.error);
  }, [userId]);

  useEffect(() => {
  const monthlyTotal = getMonthlyTotal();
  localStorage.setItem("monthlyTotal", monthlyTotal.toFixed(2));
  window.dispatchEvent(new Event("storageChanged")); // Optional if other components are listening
}, [currentDate, expenses]);


  // Save expense to Firestore
  async function addExpense(userId, expense) {
    const expensesRef = collection(db, "users", userId, "expenses");
    await addDoc(expensesRef, {
      ...expense,
      timestamp: new Date()
    });
  }

  // Handle user adding expense
  const handleAddExpense = async () => {
    if (!input.trim() || !selectedDate) return;

    const formattedDate = selectedDate;
    const amount = Number(input);
    if (isNaN(amount)) return alert("Invalid amount");

    const expenseData = {
      description: "description ig",
      date: formattedDate,
      amount,
      category: "General"
    };

    try {
      await addExpense(userId, expenseData);

      setExpenses((prev) => {
        const currentItems = prev[formattedDate]?.items || [];
        return {
          ...prev,
          [formattedDate]: {
            total: (prev[formattedDate]?.total || 0) + amount,
            items: [...currentItems, expenseData]
          }
        };
      });

      setInput("");
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Try again.");
    }
  };

  // Fetch all user expenses from Firestore
  async function fetchUserExpenses(userId) {
    const expensesRef = collection(db, "users", userId, "expenses");
    const snapshot = await getDocs(expensesRef);

    const expenseMap = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      const date = formatDate(new Date(data.date));

      if (!expenseMap[date]) {
        expenseMap[date] = { total: 0, items: [] };
      }

      expenseMap[date].total += Number(data.amount);
      expenseMap[date].items.push(data);
    });

    return expenseMap;
  }

  // OVERALL TOTAL
  useEffect(() => {
  const overallTotal = Object.values(expenses).reduce(
    (sum, dayData) => sum + dayData.total,
    0
  );
  localStorage.setItem("overallTotal", overallTotal.toFixed(2));
  window.dispatchEvent(new Event("storageChanged")); 
}, [expenses]);



  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const handleDayClick = (day) => {
    const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(formatDate(dateObj));
  };

  const generateCalendar = () => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = getDaysInMonth(year, month);

  const calendarDays = [];

  // Add empty days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="day empty"></div>);
  }

  // Add each day
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    const dateStr = formatDate(dateObj);
    const isToday =
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year;
    const isSelected = selectedDate === dateStr;

    // Get total expenses for this date (or 0)
    const totalForDay = expenses[dateStr]?.total || 0;

    calendarDays.push(
      <div
        key={day}
        className={`day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
        onClick={() => handleDayClick(day)}
      >
        <div>{day}</div>
        {totalForDay > 0 && (
          <div className="expense-summary">
            ${totalForDay.toFixed(2)}
          </div>
        )}
      </div>
    );
  }

  return calendarDays;
};


  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
          ◀
        </button>
        <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
          ▶
        </button>
      </div>

      <div className="calendar-weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div className="weekday" key={d}>{d}</div>
        ))}
      </div>

      <div className="calendar-grid">{generateCalendar()}</div>

      {selectedDate && (
  <>
    <div className="modal-overlay" onClick={() => setSelectedDate(null)} />
    <div className="expense-modal">
      <h3>Expenses for {selectedDate}</h3>
      <ul>
        {(expenses[selectedDate]?.items || []).map((item, idx) => (
          <li key={idx}>{item.amount} - {item.category}</li>
        ))}
      </ul>
      <input
        type="number"
        placeholder="Add expense"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleAddExpense}>Add</button>
      <button className="close-btn" onClick={() => setSelectedDate(null)}>Close</button>
    </div>
  </>
)}

    </div>
  );
};

export default Calendar;
