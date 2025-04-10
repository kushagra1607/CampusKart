import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { DarkModeContext } from "../App";

function Laundry() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAnimation, setShowAnimation] = useState(false);
  const { user } = useAuth();
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsResponse, ordersResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/laundry/items"),
          user
            ? axios.get("http://localhost:5000/api/laundry/orders", {
                headers: { Authorization: `Bearer ${user.token}` },
              })
            : Promise.resolve({ data: [] }),
        ]);
        setItems(itemsResponse.data);
        setOrders(ordersResponse.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const addToCart = (item) => {
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 700);
    
    const existingItem = cart.find((cartItem) => cartItem._id === item._id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item._id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      setCart(
        cart.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      setError("Please login to place an order");
      return;
    }

    if (cart.length === 0) {
      setError("Please add items to your order");
      return;
    }

    try {
      setError("");
      const orderItems = cart.map((item) => ({
        item: {
          _id: item._id,
          name: item.name,
          price: item.price,
        },
        quantity: item.quantity,
      }));

      const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const response = await axios.post(
        "http://localhost:5000/api/laundry/order",
        {
          items: orderItems,
          specialInstructions,
          totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setSuccess("Order placed successfully!");
        setCart([]);
        setSpecialInstructions("");
        // Refresh orders
        const fetchOrders = async () => {
          try {
            const ordersResponse = await axios.get(
              "http://localhost:5000/api/laundry/orders",
              {
                headers: { Authorization: `Bearer ${user.token}` },
              }
            );
            setOrders(ordersResponse.data || []);
          } catch (err) {
            console.error("Error fetching orders:", err);
          }
        };
        fetchOrders();
      }
    } catch (err) {
      console.error("Order error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to place order. Please try again.");
      }
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  // Get unique categories
  const categories = ["all", ...new Set(items.map(item => item.category || "Other"))];
  
  // Filter items by category
  const filteredItems = selectedCategory === "all" 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  // Icon components for visual enhancement
  const TshirtIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
  );

  const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  const WashingMachineIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const HistoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Cart Animation */}
      {showAnimation && (
        <div className="fixed top-5 right-5 z-50 animate-bounce">
          <div className={`p-3 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`}>
            <CartIcon />
          </div>
        </div>
      )}
      
      {/* Success Message */}
      {success && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade-in-up">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
            {success}
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade-in-up">
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
            {error}
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        <h1
          className={`text-4xl font-bold text-center mb-8 ${
            darkMode
              ? "text-gradient-to-r from-blue-400 to-teal-400"
              : "text-gradient-to-r from-blue-600 to-teal-600"
          }`}
        >
          <span className="flex items-center justify-center">
            <WashingMachineIcon />
            Laundry Service
          </span>
        </h1>
        
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold"
                    : darkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <TshirtIcon />
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Laundry Items */}
          <div className="lg:col-span-2">
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              } mb-6 flex items-center`}
            >
              <TshirtIcon />
              Available Items
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className={`${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl p-6`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className={`text-xl font-bold ${
                          darkMode ? "text-white" : "text-gray-800"
                        } mb-2`}
                      >
                        {item.name}
                      </h3>
                      <p
                        className={`${
                          darkMode ? "text-blue-400" : "text-blue-600"
                        } font-bold`}
                      >
                        ₹{item.price}
                      </p>
                      {item.category && (
                        <span
                          className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                            darkMode
                              ? "bg-blue-900 text-blue-200"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {item.category}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className={`${
                        darkMode
                          ? "bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                          : "bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                      } text-white px-3 py-2 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center`}
                    >
                      <CartIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div>
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              } mb-6 flex items-center`}
            >
              <CartIcon />
              <span className="ml-2">Your Cart</span>
              {cart.length > 0 && (
                <span className="ml-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </h2>
            
            {cart.length === 0 ? (
              <div
                className={`${
                  darkMode
                    ? "bg-gray-800 text-gray-300"
                    : "bg-white text-gray-600"
                } rounded-xl shadow-lg p-6 text-center`}
              >
                <CartIcon />
                <p className="mt-2">Your cart is empty</p>
                <p className="text-sm mt-2 text-gray-500">Add laundry items to get started</p>
              </div>
            ) : (
              <div
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } rounded-xl shadow-lg p-6`}
              >
                <div className="space-y-4 mb-4">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className={`flex justify-between items-center ${
                        darkMode
                          ? "border-b border-gray-700 pb-3"
                          : "border-b border-gray-200 pb-3"
                      }`}
                    >
                      <div>
                        <h3
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.name}
                        </h3>
                        <p
                          className={darkMode ? "text-gray-300" : "text-gray-600"}
                        >
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className={`${
                            darkMode
                              ? "bg-gray-700 hover:bg-gray-600"
                              : "bg-gray-200 hover:bg-gray-300"
                          } text-gray-800 px-2 py-1 rounded-l-md transition-colors`}
                        >
                          -
                        </button>
                        <span
                          className={`px-3 py-1 ${
                            darkMode ? "bg-gray-700" : "bg-gray-200"
                          } ${
                            darkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className={`${
                            darkMode
                              ? "bg-gray-700 hover:bg-gray-600"
                              : "bg-gray-200 hover:bg-gray-300"
                          } text-gray-800 px-2 py-1 rounded-r-md transition-colors`}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className={`ml-2 ${
                            darkMode
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-red-500 hover:bg-red-600"
                          } text-white p-1 rounded-md text-sm transition-colors`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="instructions"
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-1`}
                  >
                    Special Instructions
                  </label>
                  <textarea
                    id="instructions"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className={`w-full p-2 rounded-md ${
                      darkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-gray-100 text-gray-900 border-gray-300"
                    } border focus:ring-blue-500 focus:border-blue-500`}
                    rows="3"
                    placeholder="Any special washing instructions?"
                  ></textarea>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between mb-4">
                    <span
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Total:
                    </span>
                    <span
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ₹{calculateTotal()}
                    </span>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    className={`bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg text-sm w-full flex items-center justify-center transition-all duration-300 transform hover:scale-105`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Orders History */}
        {user && (
          <div className="mt-12">
            <h2
              className={`text-2xl font-semibold mb-6 ${
                darkMode ? "text-white" : "text-gray-900"
              } flex items-center`}
            >
              <HistoryIcon />
              Order History
            </h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className={`${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  } p-6 rounded-xl border shadow-lg transition-all duration-300 hover:shadow-xl`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                        <WashingMachineIcon />
                      </div>
                      <div>
                        <span
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Order #{order._id.slice(-6)}
                        </span>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.status || "Processing"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {order.items.map((item) => (
                      <div key={item._id} className={`flex justify-between ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg`}>
                        <span
                          className={darkMode ? "text-gray-300" : "text-gray-600"}
                        >
                          {item.item.name} × {item.quantity}
                        </span>
                        <span
                          className={darkMode ? "text-gray-300" : "text-gray-600"}
                        >
                          ₹{item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                  {order.specialInstructions && (
                    <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Special Instructions:</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{order.specialInstructions}</p>
                    </div>
                  )}
                  <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} mt-2 pt-4 flex justify-between items-center`}>
                    <span
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Total:
                    </span>
                    <span
                      className={`font-bold text-lg ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      ₹{order.totalPrice}
                    </span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div
                  className={`text-center py-8 px-4 ${
                    darkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"
                  } rounded-xl shadow-lg`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-lg font-medium mb-2">No orders yet</p>
                  <p className="text-sm">Your order history will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Laundry;
