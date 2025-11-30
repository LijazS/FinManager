import React from "react";
import Header from "./components/Header.jsx";
import axios from "axios";
import { useEffect,useState } from "react";


const LandingPage = () => {
    

    return (
        <div className="w-full min-h-screen pt-12 left-0 right-0 bg-gray-900 text-white relative pt-20">
      <div className="w-full">
        <Header />
      </div>
        <div className="pt-24 px-4 md:px-8 justify-center items-center flex flex-col text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to FinAgent</h1>
        </div>
        </div>
    );
}

export default LandingPage;