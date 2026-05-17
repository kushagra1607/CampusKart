import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../App";
import usePageTitle from "../hooks/usePageTitle";

function NotFound() {
  const { darkMode } = useContext(DarkModeContext);
  usePageTitle("Page Not Found");

  return (
    <div
      className={`min-h-[70vh] flex flex-col items-center justify-center text-center px-4 ${
        darkMode ? "text-white" : "text-gray-800"
      }`}
    >
      <div className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        404
      </div>
      <h1 className="text-3xl font-bold mt-4 mb-2">Page not found</h1>
      <p className={`mb-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
