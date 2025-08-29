import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-9xl font-extrabold text-red-800 tracking-widest">404</h1>
      <div className="bg-black px-2 animate-bounce text-sm rounded rotate-12 absolute text-white font-semibold shadow-md">
        Page Not Found
      </div>
      <p className="mt-6 text-lg text-gray-600 text-center">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-3 py-1.5 bg-black text-white font-medium rounded-md shadow hover:bg-white hover:border hover:border-black hover:text-black transition-all"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;
