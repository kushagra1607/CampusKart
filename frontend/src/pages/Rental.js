import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { DarkModeContext } from "../App";

function Rental() {
  const [items, setItems] = useState([]);
  const [myRentals, setMyRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAnimation, setShowAnimation] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [duration, setDuration] = useState(1);
  const { user } = useAuth();
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch available items
        const itemsResponse = await axios.get(
          "http://localhost:5000/api/rental/items"
        );
        if (itemsResponse.data && Array.isArray(itemsResponse.data)) {
          // Map the items to include availability based on the backend response
          const mappedItems = itemsResponse.data.map((item) => ({
            ...item,
            available: item.availability > 0, // Set available based on availability count
          }));
          setItems(mappedItems);
        }

        // Fetch user rentals if logged in
        if (user) {
          try {
            const rentalsResponse = await axios.get(
              "http://localhost:5000/api/rental/orders",
              {
                headers: { Authorization: `Bearer ${user.token}` },
              }
            );
            setMyRentals(rentalsResponse.data || []);
          } catch (rentalErr) {
            console.error("Error fetching rentals:", rentalErr);
            setMyRentals([]);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleRent = async (item) => {
    if (!user) {
      setError("Please login to rent an item");
      return;
    }
    
    setSelectedItem(item);
    setQuantity(1);
    setDuration(1);
    setShowConfirmModal(true);
  };

  // Modify confirmRent to update dates properly
  const confirmRent = async () => {
    try {
      setError("");
      setShowConfirmModal(false);
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 700);
      
      // Calculate end date based on duration
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + duration);
      
      const response = await axios.post(
        "http://localhost:5000/api/rental/rent",
        {
          itemId: selectedItem._id,
          quantity: quantity,
          duration: duration,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setSuccess("Item rented successfully!");
        refreshData();
      }
    } catch (err) {
      console.error("Rental error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to rent item. Please try again.");
      }
    }
  };

  const refreshData = async () => {
    try {
      // Fetch updated items
      const itemsResponse = await axios.get(
        "http://localhost:5000/api/rental/items"
      );
      if (itemsResponse.data && Array.isArray(itemsResponse.data)) {
        const mappedItems = itemsResponse.data.map((item) => ({
          ...item,
          available: item.availability > 0,
        }));
        setItems(mappedItems);
      }

      // Fetch updated rentals if user is logged in
      if (user) {
        const rentalsResponse = await axios.get(
          "http://localhost:5000/api/rental/orders",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setMyRentals(rentalsResponse.data || []);
      }
    } catch (err) {
      console.error("Error refreshing data:", err);
    }
  };

  // Fix the handleCancelRental function to match the backend endpoint
  const handleCancelRental = async (rentalId) => {
    if (!user) {
      setError("Please login to return an item");
      return;
    }

    try {
      setError("");
      // Using the correct endpoint from the backend
      const response = await axios.put(
        `http://localhost:5000/api/rental/orders/${rentalId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response && response.data) {
        setSuccess("Item returned successfully!");
        refreshData();
      }
    } catch (err) {
      console.error("Return error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to return item. Please try again.");
      }
    }
  };

  // Get all unique categories for filtering
  const categories = ["all", ...new Set(items.map(item => item.category || "Other"))];
  
  // Filter items by selected category
  const filteredItems = selectedCategory === "all" 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  // Icon components for visual enhancement
  const EquipmentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  );

  const RentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const HistoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  // Helper function to get image path based on item title
  const getImagePath = (item) => {
    if (!item || !item.title) return "/images/Projector.jpeg"; // default image
    
    // Map item titles to image filenames
    const titleToImage = {
      "Projector": "/images/Projector.jpeg",
      "Tent": "/images/Tent.jpeg",
      "Bicycle": "/images/Bicycle.jpeg",
      "Camera": "/images/Camera.jpeg",
      "Gaming Console": "/images/Gaming_Console.jpeg"
    };
    
    // Try to find exact match first
    if (titleToImage[item.title]) {
      return titleToImage[item.title];
    }
    
    // Try to find partial match
    for (const [key, value] of Object.entries(titleToImage)) {
      if (item.title.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }
    
    // Try to match by category
    if (item.category === "Electronics") return "/images/Projector.jpeg";
    if (item.category === "Outdoor") return "/images/Tent.jpeg";
    if (item.category === "Transport") return "/images/Bicycle.jpeg";
    if (item.category === "Entertainment") return "/images/Gaming_Console.jpeg";
    
    // Fallback to a default image
    return "/images/Projector.jpeg";
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Animation */}
      {showAnimation && (
        <div className="fixed top-5 right-5 z-50 animate-bounce">
          <div className={`p-3 rounded-full ${darkMode ? 'bg-purple-600' : 'bg-purple-500'} text-white`}>
            <RentIcon />
          </div>
        </div>
      )}
      
      {/* Success Message */}
      {success && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade-in-up">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {success}
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade-in-up">
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <h1
          className={`text-4xl font-bold text-center mb-8 ${
            darkMode
              ? "text-gradient-to-r from-purple-400 to-pink-400"
              : "text-gradient-to-r from-purple-600 to-pink-600"
          }`}
        >
          <span className="flex items-center justify-center">
            <EquipmentIcon />
            Equipment Rental
          </span>
        </h1>

        {/* Rental Confirmation Modal */}
        {showConfirmModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-6 max-w-md w-full`}>
              <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"} mb-4`}>
                Confirm Rental
              </h3>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4`}>
                Do you want to rent {selectedItem.title}?
              </p>
              
              <div className="mb-4">
                <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedItem.availability}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(selectedItem.availability, Math.max(1, parseInt(e.target.value) || 1)))}
                  className={`w-full p-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-300"}`}
                />
              </div>
              
              <div className="mb-6">
                <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                  Duration (days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={duration}
                  onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                  className={`w-full p-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-300"}`}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className={`px-4 py-2 rounded ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmRent()}
                  className="px-4 py-2 rounded bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold"
                      : darkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {category === "Electronics" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  ) : category === "Camping" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  ) : category === "all" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  ) : (
                    <EquipmentIcon />
                  )}
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Available Equipment */}
          <div className="lg:col-span-2">
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              } mb-6 flex items-center`}
            >
              <EquipmentIcon />
              Available Equipment
            </h2>
            
            {filteredItems.length === 0 ? (
              <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg p-8 text-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className={`text-xl font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>No equipment available in this category</p>
                <p className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Try selecting a different category or check back later</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className={`${
                      darkMode ? "bg-gray-800" : "bg-white"
                    } rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
                  >
                    <div className="relative">
                      <img
                        src={getImagePath(item)}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/Projector.jpeg";
                        }}
                      />
                      {item.category && (
                        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                          darkMode ? "bg-purple-900 text-purple-200" : "bg-purple-100 text-purple-800"
                        }`}>
                          {item.category}
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3
                        className={`text-xl font-bold ${
                          darkMode ? "text-white" : "text-gray-800"
                        } mb-2`}
                      >
                        {item.title}
                      </h3>
                      <div className="flex justify-between items-center mb-4">
                        <p
                          className={`${
                            darkMode ? "text-purple-400" : "text-purple-600"
                          } font-bold text-lg`}
                        >
                          ₹{item.price}/day
                        </p>
                        <p
                          className={`${
                            item.availability > 0
                              ? darkMode
                                ? "text-green-400"
                                : "text-green-600"
                              : darkMode
                              ? "text-red-400"
                              : "text-red-600"
                          } mt-1 text-sm`}
                        >
                          Available: {item.availability || 0} units
                        </p>
                      </div>
                      <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4 text-sm line-clamp-2`}>
                        {item.description}
                      </p>
                      {item.availability > 0 ? (
                        <button
                          onClick={() => handleRent(item)}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                        >
                          <RentIcon />
                          Rent Now
                        </button>
                      ) : (
                        <button
                          disabled
                          className={`w-full ${
                            darkMode ? "bg-gray-700" : "bg-gray-400"
                          } text-white py-2 px-4 rounded-lg cursor-not-allowed flex items-center justify-center`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Out of Stock
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Rentals */}
          <div>
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              } mb-6 flex items-center`}
            >
              <HistoryIcon />
              My Rentals
              {myRentals.length > 0 && (
                <span className="ml-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {myRentals.length}
                </span>
              )}
            </h2>
            
            {!user ? (
              <div
                className={`${
                  darkMode
                    ? "bg-gray-800 text-gray-300"
                    : "bg-white text-gray-600"
                } rounded-xl shadow-lg p-6 text-center`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-lg font-medium mb-2">Please log in</p>
                <p className="text-sm">You need to log in to see your rentals</p>
              </div>
            ) : myRentals.length === 0 ? (
              <div
                className={`${
                  darkMode
                    ? "bg-gray-800 text-gray-300"
                    : "bg-white text-gray-600"
                } rounded-xl shadow-lg p-6 text-center`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium mb-2">No active rentals</p>
                <p className="text-sm">Rent equipment to see them listed here</p>
              </div>
            ) : (
              <div className="space-y-6">
                {myRentals.map((rental) => (
                  <div
                    key={rental._id}
                    className={`${
                      darkMode ? "bg-gray-800" : "bg-white"
                    } rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
                  >
                    <div className="flex border-b border-gray-700">
                      <div className="w-24 h-24">
                        <img 
                          src={getImagePath(rental.item)} 
                          alt={rental.item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/Projector.jpeg";
                          }}
                        />
                      </div>
                      <div className="p-3 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3
                              className={`text-xl font-bold ${
                                darkMode ? "text-white" : "text-gray-800"
                              } mb-2`}
                            >
                              {rental.item.title}
                            </h3>
                            <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                              darkMode ? "bg-purple-900 text-purple-200" : "bg-purple-100 text-purple-800"
                            }`}>
                              {rental.item.category || "Equipment"}
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isOverdue(rental.endDate)
                              ? "bg-red-100 text-red-800"
                              : isToday(rental.endDate)
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}>
                            {isOverdue(rental.endDate)
                              ? "Overdue"
                              : isToday(rental.endDate)
                              ? "Due Today"
                              : "Active"}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Rented On</p>
                            <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                              {formatDate(rental.startDate)}
                            </p>
                          </div>
                          <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Due Date</p>
                            <p className={`${
                              isOverdue(rental.endDate)
                                ? "text-red-500 font-bold"
                                : isToday(rental.endDate)
                                ? "text-yellow-500 font-bold"
                                : darkMode
                                ? "text-gray-300"
                                : "text-gray-600"
                            }`}>
                              {formatDate(rental.endDate)}
                            </p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleCancelRental(rental._id)}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Return Item
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to check if a date is in the past
function isOverdue(dateString) {
  if (!dateString) return false;
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString);
    return date < today;
  } catch (e) {
    return false;
  }
}

// Helper function to check if a date is today
function isToday(dateString) {
  if (!dateString) return false;
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  } catch (e) {
    return false;
  }
}

// Helper function to format dates nicely
function formatDate(dateString) {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  } catch (e) {
    return "N/A";
  }
}

export default Rental;
