import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";




const Signup = () => {


    const navigate = useNavigate(); 

          const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


    const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

/*      HANDLING SUBMISSION                  */

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/signup`, formData,{
        headers: { "Content-Type": "application/json" },});
        

      const data = await response.data;
      console.log("Response:", data);


       localStorage.setItem("userEmail", formData.email);
       localStorage.setItem("userName", formData.name);
      //  localStorage.setItem("token", data.token);
      //  navigate("/");

    } catch (error) {
       if (error.response) {
      console.error("Login failed:", error.response.data);
      alert("Login failed: " + error.response.data.message);
    } else {
      console.error("Error occurred during login:", error.message);
      alert("Login failed: " + error.message);
    }
    }
  };

  return (
    <div className="w-full top-0 fixed left-0 min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Register
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Create a new account
          </p>
        </div>

        {/* Form */}
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-6" onSubmit={handleSubmit}>


          <div className="sm:col-span-2 ">
            <label
              htmlFor="email"
              className="block mb-2 text-sm text-gray-700 dark:text-gray-300 "
            >
              Email*
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="password"
              className="block mb-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Password*
            </label>
            <input
              name="password"
              type="password"
                value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

           <div className="sm:col-span-2">
            <label
              htmlFor="password"
              className="block mb-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Re-enter Password*
            </label>
            <input
              name="password"
              type="password"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

         


       <div className="w-full sm:col-span-2 relative flex justify-center items-center">
  <button
    type="submit"
    className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-8 py-3 text-sm font-semibold text-white transition duration-150 cursor-pointer"
  >
    Register
  </button>

  <span className="absolute right-0 text-sm text-gray-500 dark:text-gray-400">
    *Required
  </span>
</div>



          <p className="text-xs text-gray-400 dark:text-gray-500 sm:col-span-2 text-center">
            By signing up you agree to our{" "}
            <a
              href="#"
              className="underline hover:text-indigo-400 transition-colors duration-150"
            >
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
