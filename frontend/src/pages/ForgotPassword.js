import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../App";
import { motion } from "framer-motion";
import axios from "axios";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Enter mobile, 2: Enter verification code, 3: Enter new password
  const [mobile, setMobile] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [receivedCode, setReceivedCode] = useState(""); // Store the received verification code
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle countdown for resend code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendVerificationCode = async () => {
    if (!mobile) {
      setError("Please enter your mobile number");
      return;
    }

    setLoading(true);
    try {
      // Call your backend API to send verification code
      const response = await axios.post("http://localhost:5000/api/auth/send-verification", {
        mobile,
      });
      
      // Check if we're in test mode and display the code directly
      if (response.data.testMode && response.data.verificationCode) {
        setReceivedCode(response.data.verificationCode);
        setSuccess(`Verification code sent successfully (Test Mode)`);
      } else {
        setSuccess("Verification code sent to your mobile number");
      }
      
      setStep(2);
      setCountdown(60); // 60 seconds countdown for resend
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to auto-fill verification code
  const autofillVerificationCode = () => {
    if (receivedCode) {
      setVerificationCode(receivedCode);
    }
  };

  const verifyCodeAndProceed = async () => {
    if (!verificationCode) {
      setError("Please enter the verification code");
      return;
    }

    setLoading(true);
    try {
      // Call your backend API to verify the code
      const response = await axios.post("http://localhost:5000/api/auth/verify-code", {
        mobile,
        verificationCode,
      });
      
      setSuccess("Code verified successfully");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      // Call your backend API to reset the password
      const response = await axios.post("http://localhost:5000/api/auth/reset-password", {
        mobile,
        verificationCode,
        newPassword,
      });
      
      setSuccess("Password reset successfully! You can now login with your new password.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
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
        staggerChildren: 0.2,
        delayChildren: 0.2
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
      
      <motion.div 
        className={`relative z-10 max-w-md w-full p-8 rounded-2xl shadow-xl ${
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
              {step === 1 && "Forgot Password"}
              {step === 2 && "Verify Code"}
              {step === 3 && "Reset Password"}
            </motion.h2>
            <motion.p 
              className={`mt-2 text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {step === 1 && "Enter your mobile number to receive a verification code"}
              {step === 2 && "Enter the verification code sent to your mobile"}
              {step === 3 && "Create a new password for your account"}
            </motion.p>
          </div>
        </motion.div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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
          
          {success && (
            <motion.div
              className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-md"
              role="alert"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="block font-medium">{success}</span>
              </div>
            </motion.div>
          )}
          
          {step === 1 && (
            <motion.div variants={itemVariants} className="space-y-4">
              <div>
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
                    placeholder="Enter your mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
              </div>
              
              <motion.div variants={itemVariants}>
                <motion.button
                  type="button"
                  disabled={loading}
                  onClick={sendVerificationCode}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                  )}
                  {loading ? "Sending code..." : "Send Verification Code"}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div variants={itemVariants} className="space-y-4">
              <div>
                <label htmlFor="verificationCode" className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                  Verification Code
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="verificationCode"
                    name="verificationCode"
                    type="text"
                    required
                    className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500" : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                      darkMode ? "focus:ring-purple-500" : "focus:ring-blue-500"
                    } transition-all duration-300`}
                    placeholder="Enter verification code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                </div>
                
                {receivedCode && (
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      Your verification code: <span className="font-bold text-blue-600">{receivedCode}</span>
                    </p>
                    <button
                      type="button"
                      onClick={autofillVerificationCode}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      Auto-fill
                    </button>
                  </div>
                )}
                
                {countdown > 0 ? (
                  <p className="mt-2 text-sm text-gray-500">
                    Resend code in {countdown} seconds
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={sendVerificationCode}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-500"
                  >
                    Resend code
                  </button>
                )}
              </div>
              
              <motion.div variants={itemVariants}>
                <motion.button
                  type="button"
                  disabled={loading}
                  onClick={verifyCodeAndProceed}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  )}
                  {loading ? "Verifying..." : "Verify Code"}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div variants={itemVariants} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                  New Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500" : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                      darkMode ? "focus:ring-purple-500" : "focus:ring-blue-500"
                    } transition-all duration-300`}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                  Confirm Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500" : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                      darkMode ? "focus:ring-purple-500" : "focus:ring-blue-500"
                    } transition-all duration-300`}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <motion.div variants={itemVariants}>
                <motion.button
                  type="button"
                  disabled={loading}
                  onClick={resetPassword}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  )}
                  {loading ? "Resetting password..." : "Reset Password"}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </form>

        <motion.div 
          className="mt-8 text-center"
          variants={itemVariants}
        >
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Remember your password?
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
              Back to Login
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
