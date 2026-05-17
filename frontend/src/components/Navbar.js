import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DarkModeContext } from "../App";

function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/restaurant", label: "Restaurant" },
    { to: "/library", label: "Library" },
    { to: "/laundry", label: "Laundry" },
    { to: "/rental", label: "Rental" },
  ];

  if (user) {
    navLinks.push({ to: "/orders", label: "My Orders" });
    navLinks.push({ to: "/admin", label: "Admin" });
  }

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const linkClass = (to) =>
    `inline-flex items-center px-1 pt-1 border-b-2 transition-colors ${
      isActive(to)
        ? "border-blue-500 " + (darkMode ? "text-white" : "text-gray-900")
        : "border-transparent " +
          (darkMode
            ? "text-gray-300 hover:text-white"
            : "text-gray-500 hover:text-gray-700")
    }`;

  const mobileLinkClass = (to) =>
    `block px-4 py-3 rounded-lg font-medium transition-colors ${
      isActive(to)
        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        : darkMode
        ? "text-gray-300 hover:bg-gray-700"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <nav className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              to="/"
              className="flex items-center gap-2"
              onClick={() => setMenuOpen(false)}
            >
              <span className="text-2xl">🛒</span>
              <span
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                CampusKart
              </span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              {navLinks.map((l) => (
                <Link key={l.to} to={l.to} className={linkClass(l.to)}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
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

            <div className="hidden md:flex md:items-center md:space-x-3">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium ${
                      darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                    </span>
                    <span className="max-w-[100px] truncate">{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:from-red-600 hover:to-pink-600 hover:scale-105"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex space-x-2">
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
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-700 hover:to-purple-700"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className={`md:hidden p-2 rounded-lg ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div
          className={`md:hidden px-4 pb-4 space-y-1 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className={mobileLinkClass(l.to)}
            >
              {l.label}
            </Link>
          ))}
          <div
            className={`pt-3 mt-3 border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClass("/profile")}
                >
                  Profile ({user.name})
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left mt-1 px-4 py-3 rounded-lg font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClass("/login")}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClass("/register")}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
