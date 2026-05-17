import React, { useState, useEffect, useContext } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PageTransition from "./components/PageTransition";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Restaurant from "./pages/Restaurant";
import Library from "./pages/Library";
import Laundry from "./pages/Laundry";
import Rental from "./pages/Rental";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

export const DarkModeContext = React.createContext();

const ROUTE_TITLES = {
  "/": "CampusKart",
  "/login": "Login | CampusKart",
  "/register": "Register | CampusKart",
  "/forgot-password": "Reset Password | CampusKart",
  "/restaurant": "Restaurant | CampusKart",
  "/library": "Library | CampusKart",
  "/laundry": "Laundry | CampusKart",
  "/rental": "Rental | CampusKart",
  "/orders": "My Orders | CampusKart",
  "/profile": "Profile | CampusKart",
  "/admin": "Admin Panel | CampusKart",
};

function Layout() {
  const { user } = useAuth();
  const { darkMode } = useContext(DarkModeContext);
  const location = useLocation();

  useEffect(() => {
    document.title = ROUTE_TITLES[location.pathname] || "CampusKart";
  }, [location.pathname]);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 to-gray-100"
      }`}
    >
      <Navbar />
      {user && (
        <div
          className={`text-center py-3 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow-md`}
        >
          <h2
            className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            <span className="text-blue-600">Welcome, {user.name}!</span>
            <span className={darkMode ? "text-gray-400 ml-2" : "text-gray-600 ml-2"}>
              to
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 ml-2">
              CampusKart
            </span>
          </h2>
        </div>
      )}
      <Outlet />
    </div>
  );
}

const wrap = (element) => <PageTransition>{element}</PageTransition>;

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: wrap(<Home />) },
        { path: "login", element: wrap(<Login />) },
        { path: "register", element: wrap(<Register />) },
        { path: "forgot-password", element: wrap(<ForgotPassword />) },
        { path: "laundry", element: wrap(<Laundry />) },
        { path: "library", element: wrap(<Library />) },
        { path: "restaurant", element: wrap(<Restaurant />) },
        { path: "rental", element: wrap(<Rental />) },
        { path: "orders", element: wrap(<OrderHistory />) },
        { path: "profile", element: wrap(<Profile />) },
        { path: "admin", element: wrap(<Admin />) },
        { path: "*", element: wrap(<NotFound />) },
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
