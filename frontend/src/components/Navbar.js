import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DarkModeContext } from "../App";

function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              to="/"
              className={`flex items-center ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              <span className="text-xl font-bold">CampusKart</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 ${
                  darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Home
              </Link>
              <Link
                to="/restaurant"
                className={`inline-flex items-center px-1 pt-1 ${
                  darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Restaurant
              </Link>
              <Link
                to="/library"
                className={`inline-flex items-center px-1 pt-1 ${
                  darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Library
              </Link>
              <Link
                to="/laundry"
                className={`inline-flex items-center px-1 pt-1 ${
                  darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Laundry
              </Link>
              <Link
                to="/rental"
                className={`inline-flex items-center px-1 pt-1 ${
                  darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Rental
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {darkMode ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {user ? (
              <button
                onClick={handleLogout}
                className={`bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium transform transition-all duration-300 hover:from-red-600 hover:to-pink-600 hover:scale-105 hover:shadow-lg active:scale-95 flex items-center space-x-2`}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className={`${
                    darkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-800"
                  } px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`${
                    darkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-800"
                  } px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
