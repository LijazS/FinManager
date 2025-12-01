import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {

  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  
    useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);
      
     

    const handleLogout = () => {
  // Clear all stored data (or just specific keys)
  localStorage.removeItem("userEmail");
  localStorage.removeItem("token"); // if using JWT later

  // Optionally clear everything:
  // localStorage.clear();

  // Redirect to login page
  window.dispatchEvent(new Event("storage")); 
  window.location.href = "/"; 
};

    return (
        <div className="fixed inset-x-0 top-0 z-50 bg-[#121212] border-b border-[#ffffff2d] shadow-md">

  <div className="w-full px-4 md:px-8 top-0">
    <header className="w-full flex items-center justify-between py-4 md:py-5 px-4 md:px-8">
      <a href="/" className="inline-flex items-center gap-2.5 text-2xl font-bold text-white md:text-3xl" aria-label="logo">
        <img
    src="/finance-logo.svg"
    alt="FinAgent logo"
    className="w-10 h-auto"   // ← same size as your old SVG
  />

                FinAgent
     
     </a>
      <nav className="hidden gap-12 lg:flex">
        {token ? <Link to="/dashboard" className="text-lg font-semibold text-gray-300 transition duration-100 hover:text-indigo-500 active:text-indigo-700">Home</Link> : 
        <Link to="/" className="text-lg font-semibold text-gray-300 transition duration-100 hover:text-indigo-500 active:text-indigo-700">Home</Link>}
        <a href="#" className="text-lg font-semibold text-gray-300 transition duration-100 hover:text-indigo-500 active:text-indigo-700">Pricing</a>
        <a href="#" className="text-lg font-semibold text-gray-300 transition duration-100 hover:text-indigo-500 active:text-indigo-700">About</a>
      </nav>
     
      <div className="-ml-8 hidden flex-col gap-2.5 sm:flex-row sm:justify-center lg:flex lg:justify-start">
        {token ? (
          <>
          <Link onClick={handleLogout} className="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base">Sign Out</Link>
            
          </>
        ) : (
          <>
          <Link to="/signin" className="inline-block rounded-lg px-4 py-3 text-center text-sm font-semibold text-gray-100 outline-none ring-indigo-300 transition duration-100 hover:text-indigo-500 focus-visible:ring active:text-indigo-600 md:text-base">Sign in</Link>
            <Link to="/signup" className="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base">Sign up
            </Link>
          </>
        )}
      </div>

      <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-2.5 py-2 text-sm font-semibold text-gray-500 ring-indigo-300 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>

        Menu
      </button>
     
    </header>

       
      </div>
    </div>
    );
}

export default Header;