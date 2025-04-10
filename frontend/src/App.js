import React, { useState, useEffect, useContext } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Restaurant from "./pages/Restaurant";
import Library from "./pages/Library";
import Laundry from "./pages/Laundry";
import Rental from "./pages/Rental";

export const DarkModeContext = React.createContext();

function Layout() {
  const { user } = useAuth();
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 to-gray-100"}`}>
      <Navbar />
      {user && (
        <div className={`text-center py-4 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md animate-fade-in`}>
          <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"} transform transition-all duration-500 hover:scale-105 animate-[bounce_1s_ease-in-out_infinite]`}>
            <span className="text-blue-600 animate-[pulse_1s_ease-in-out_infinite]">
              Welcome, {user.name}!
            </span>
            <span className={`${darkMode ? "text-gray-400" : "text-gray-600"} ml-2 animate-[pulse_1s_ease-in-out_infinite]`}>
              to
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 ml-2 animate-[pulse_1s_ease-in-out_infinite]">
              CampusKart
            </span>
          </h2>
        </div>
      )}
      <Outlet />
    </div>
  );
}

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "laundry", element: <Laundry /> },
        { path: "library", element: <Library /> },
        { path: "restaurant", element: <Restaurant /> },
        { path: "rental", element: <Rental /> },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </DarkModeContext.Provider>
  );
}

export default App;
