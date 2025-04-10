import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
      // Fetch user data
      axios
        .get("http://localhost:5000/api/auth/me")
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["x-auth-token"];
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (mobile, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        mobile,
        password,
      });
      const { token } = res.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["x-auth-token"] = token;

      // Fetch user data after successful login
      const userRes = await axios.get("http://localhost:5000/api/auth/me");
      setUser(userRes.data);

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        userData
      );
      const { token } = res.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["x-auth-token"] = token;

      // Fetch user data after successful registration
      const userRes = await axios.get("http://localhost:5000/api/auth/me");
      setUser(userRes.data);

      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["x-auth-token"];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
