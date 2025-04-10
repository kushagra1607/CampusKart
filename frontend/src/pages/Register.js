import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DarkModeContext } from "../App";
import { motion } from "framer-motion";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    password: "",
    rollNo: "",
    hostel: "",
    roomNo: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { darkMode } = useContext(DarkModeContext);
  
  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const result = await register(formData);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };
  
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 300, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-r from-purple-50 to-blue-50 text-gray-900"
    }`}
    style={{
      backgroundImage: "url('/images/background.jpeg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      width: '100%',
      overflow: 'hidden',
    }}>
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/4 bottom-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute right-1/3 top-1/3 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <motion.div 
        className={`relative z-10 max-w-xl w-full p-8 rounded-2xl shadow-xl ${
          darkMode ? "bg-gray-800 bg-opacity-90" : "bg-white bg-opacity-90"
        }`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <div className="text-center mb-8">
            <motion.h2 
              className={`text-4xl font-extrabold ${
                darkMode ? "text-white" : "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"
              }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Join CampusKart
            </motion.h2>
            <motion.p 
              className={`mt-2 text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Create your account to access campus services
            </motion.p>
          </div>
        </motion.div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <motion.div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md"
              role="alert"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="block font-medium">{error}</span>
              </div>
            </motion.div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <motion.div variants={itemVariants}>
              <label htmlFor="name" className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                Full Name
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500" : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    darkMode ? "focus:ring-purple-500" : "focus:ring-blue-500"
                  } transition-all duration-300`}
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="mobile" className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                Mobile Number
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  required
                  className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500" : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    darkMode ? "focus:ring-purple-500" : "focus:ring-blue-500"
                  } transition-all duration-300`}
                  placeholder="Your mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="rollNo" className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                Roll Number
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </div>
                <input
                  id="rollNo"
                  name="rollNo"
                  type="text"
                  required
                  className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500" : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    darkMode ? "focus:ring-purple-500" : "focus:ring-blue-500"
                  } transition-all duration-300`}
                  placeholder="Your roll number"
                  value={formData.rollNo}
                  onChange={handleChange}
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="hostel" className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                Hostel
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 1.414l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                <input
                  id="hostel"
                  name="hostel"
                  type="text"
                  required
                  className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500" : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    darkMode ? "focus:ring-purple-500" : "focus:ring-blue-500"
                  } transition-all duration-300`}
                  placeholder="Your hostel name"
                  value={formData.hostel}
                  onChange={handleChange}
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="roomNo" className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                Room Number
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM11 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="roomNo"
                  name="roomNo"
                  type="text"
                  required
                  className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500" : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    darkMode ? "focus:ring-purple-500" : "focus:ring-blue-500"
                  } transition-all duration-300`}
                  placeholder="Your room number"
                  value={formData.roomNo}
                  onChange={handleChange}
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`appearance-none block w-full pl-10 pr-10 py-3 border ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500" : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    darkMode ? "focus:ring-purple-500" : "focus:ring-blue-500"
                  } transition-all duration-300`}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
            </motion.div>
          </div>

          <motion.div 
            variants={itemVariants}
            className="pt-4"
          >
            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white ${
                darkMode 
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" 
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                darkMode ? "focus:ring-purple-500" : "focus:ring-blue-500"
              } transition-all duration-300 transform`}
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 0112 0v1H3v-1a4 4 0 0112 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
              )}
              {loading ? "Creating account..." : "Create Account"}
            </motion.button>
          </motion.div>
        </form>

        <motion.div 
          className="mt-8 text-center"
          variants={itemVariants}
        >
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Already have an account?
          </p>
          <motion.div
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            className="mt-3"
          >
            <Link
              to="/login"
              className={`inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg ${
                darkMode 
                ? "bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-800 hover:to-gray-900" 
                : "bg-white text-blue-600 hover:bg-gray-50"
              } shadow-sm transition-all duration-300`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              Sign in instead
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
