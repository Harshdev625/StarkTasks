// src/pages/NotFound.js

import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleHomeClick = () => {
    if (token) {
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-500 mb-6">404</h1>
      <p className="text-xl font-medium mb-4">Page Not Found</p>
      <p className="text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={handleHomeClick}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
