import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../App";

const styles = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

function Home() {
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

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

  const teamMembers = [
    {
      name: "Kushagra",
      mobile: "9576750084",
      email: "kushagra832005@gmail.com",
      instagram: "kushagra073",
      color: "from-purple-500 to-purple-600",
      icon: "💻",
      role: "Lead Developer"
    }
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

      <div className="mt-12">
        <h2 className={`text-4xl font-bold mb-8 ${darkMode ? "text-white" : "text-gray-900"} text-center`}>
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className={`relative p-6 rounded-2xl border transition-all duration-500 transform hover:scale-105 hover:shadow-xl ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
              style={{
                animation: `fade-in ${index + 1}s ease-out forwards`,
              }}
            >
              <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full ${
                darkMode ? "bg-gray-700" : "bg-white"
              } flex items-center justify-center`}>
                <span className={`text-4xl ${darkMode ? "text-white" : "text-gray-900"} font-bold`}>
                  {member.icon}
                </span>
              </div>
              <h3 className={`text-2xl font-bold mb-2 mt-8 ${darkMode ? "text-white" : "text-gray-900"}`}>
                {member.name}
              </h3>
              <p className={`text-lg font-medium mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {member.role}
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    📱
                  </span>
                  <div className="ml-2">
                    <span className={`block text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Mobile No.
                    </span>
                    <span className={`block ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {member.mobile}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    📧
                  </span>
                  <div className="ml-2">
                    <span className={`block text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Email
                    </span>
                    <span className={`block ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {member.email}
                    </span>
                  </div>
                </div>
                {member.instagram && (
                  <div className="flex items-center">
                    <span className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      📸
                    </span>
                    <div className="ml-2">
                      <span className={`block text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Instagram ID
                      </span>
                      <a
                        href={`https://instagram.com/${member.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block ${darkMode ? "text-purple-400" : "text-purple-600"} hover:text-purple-500 transition-colors`}
                      >
                        {member.instagram}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
