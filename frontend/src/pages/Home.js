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
      initials: "K",
      mobile: "9576750084",
      email: "kushagra832005@gmail.com",
      instagram: "kushagra073",
      github: "kushagra1607",
      roles: ["Lead Developer", "Full Stack Developer", "Project Manager", "UI/UX Designer"],
      color: "from-purple-500 to-indigo-600",
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

      <div className="mt-16">
        <h2 className={`text-4xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"} text-center`}>
          Contact
        </h2>
        <p className={`text-center mb-10 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Get in touch with the developer
        </p>
        <div className="flex justify-center">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className={`w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-purple-500/20 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
              style={{ animation: `fade-in ${index + 1}s ease-out forwards` }}
            >
              {/* Gradient header with avatar */}
              <div className={`bg-gradient-to-r ${member.color} p-8 flex flex-col items-center`}>
                <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center mb-3">
                  <span className="text-3xl font-bold text-white">{member.initials}</span>
                </div>
                <h3 className="text-2xl font-bold text-white">{member.name}</h3>
              </div>

              {/* Roles */}
              <div className="px-6 py-4 flex flex-wrap gap-2 justify-center border-b border-gray-200 dark:border-gray-700">
                {member.roles.map((role) => (
                  <span
                    key={role}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      darkMode
                        ? "bg-purple-900/50 text-purple-300 border border-purple-700"
                        : "bg-purple-50 text-purple-700 border border-purple-200"
                    }`}
                  >
                    {role}
                  </span>
                ))}
              </div>

              {/* Contact info */}
              <div className="px-6 py-4 space-y-3">
                <a href={`tel:${member.mobile}`} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}>
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">📱</div>
                  <div>
                    <p className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-400"}`}>Mobile</p>
                    <p className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{member.mobile}</p>
                  </div>
                </a>
                <a href={`mailto:${member.email}`} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}>
                  <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">📧</div>
                  <div>
                    <p className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-400"}`}>Email</p>
                    <p className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{member.email}</p>
                  </div>
                </a>
                {member.instagram && (
                  <a href={`https://instagram.com/${member.instagram}`} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}>
                    <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 flex-shrink-0">📸</div>
                    <div>
                      <p className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-400"}`}>Instagram</p>
                      <p className={`font-medium ${darkMode ? "text-purple-400" : "text-purple-600"}`}>@{member.instagram}</p>
                    </div>
                  </a>
                )}
                {member.github && (
                  <a href={`https://github.com/${member.github}`} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"}`}>🐙</div>
                    <div>
                      <p className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-400"}`}>GitHub</p>
                      <p className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{member.github}</p>
                    </div>
                  </a>
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
