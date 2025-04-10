import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../App";

function Home() {
  const { darkMode } = useContext(DarkModeContext);

  const services = [
    {
      title: "Restaurant",
      description: "Order food from campus restaurants",
      path: "/restaurant",
      icon: "🍽️",
    },
    {
      title: "Library",
      description: "Browse and borrow books",
      path: "/library",
      icon: "📚",
    },
    {
      title: "Laundry",
      description: "Schedule laundry services",
      path: "/laundry",
      icon: "👕",
    },
    {
      title: "Rental",
      description: "Rent equipment and items",
      path: "/rental",
      icon: "📦",
    },
  ];

  return (
    <div className={`${darkMode ? "text-white" : "text-gray-800"}`}>
      <div className="text-center mb-12">
        <h1
          className={`text-4xl font-bold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Welcome to CampusKart
        </h1>
        <p
          className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"}`}
        >
          Your one-stop solution for campus services
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <Link
            key={service.title}
            to={service.path}
            className={`${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700 border-gray-700"
                : "bg-white hover:bg-gray-50 border-gray-200"
            } p-6 rounded-lg border transition-all transform hover:scale-105 shadow-lg`}
          >
            <div className="text-4xl mb-4">{service.icon}</div>
            <h2
              className={`text-xl font-semibold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {service.title}
            </h2>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              {service.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
