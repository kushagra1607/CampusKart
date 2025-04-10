import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { DarkModeContext } from "../App";

function Restaurant() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useAuth();
  const { darkMode } = useContext(DarkModeContext);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const categories = [
    "all",
    "breakfast",
    "lunch",
    "dinner",
    "snacks",
    "beverages",
  ];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/restaurant/menu"
        );
        setMenu(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch menu");
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Filter out duplicate food items based on their name
  const uniqueMenu = menu.filter((item, index, self) =>
    index === self.findIndex((t) => t.name === item.name)
  );

  const filteredItems =
    selectedCategory === "all"
      ? uniqueMenu
      : uniqueMenu.filter((item) => item.category === selectedCategory);

  const addToCart = (item) => {
    setCart([...cart, item]);
    setSuccess(`${item.name} added to cart!`);
    setTimeout(() => setSuccess(""), 3000);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleOrder = async () => {
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
        menuItem: item._id,
        quantity: 1, // Since we're not tracking quantity in cart yet
        price: item.price,
      }));

      const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

      const response = await axios.post(
        "http://localhost:5000/api/restaurant/order",
        {
          items: orderItems,
          totalPrice,
          specialInstructions: specialInstructions || "",
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
      }
    } catch (err) {
      console.error("Order error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to place order. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 to-gray-100"
      } py-12`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1
            className={`text-4xl font-extrabold ${
              darkMode
                ? "text-white"
                : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
            } mb-4`}
          >
            Restaurant
          </h1>
          <p
            className={`text-xl ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Order your favorite meals
          </p>
        </div>

        {error && (
          <div
            className={`${darkMode ? "bg-red-900" : "bg-red-100"} border ${
              darkMode ? "border-red-700" : "border-red-400"
            } ${
              darkMode ? "text-red-100" : "text-red-700"
            } px-4 py-3 rounded relative mb-6`}
          >
            {error}
          </div>
        )}

        {success && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
            <div
              className={`${
                darkMode ? "bg-green-900" : "bg-green-100"
              } border ${darkMode ? "border-green-700" : "border-green-400"} ${
                darkMode ? "text-green-100" : "text-green-700"
              } px-8 py-4 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out animate-bounce-in`}
            >
              <div className="flex items-center">
                <svg
                  className={`h-6 w-6 ${
                    darkMode ? "text-green-400" : "text-green-500"
                  } mr-2`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="font-semibold">{success}</span>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full capitalize ${
                selectedCategory === category
                  ? darkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white"
                  : darkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Menu */}
          <div>
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              } mb-6`}
            >
              Menu
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className={`${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
                >
                  <div className="p-6">
                    <img
                      src={`http://localhost:5000${item.image}`}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      onError={(e) => {
                        console.error(`Error loading image for ${item.name}:`, e);
                      }}
                    />
                    <h3
                      className={`text-2xl font-bold ${
                        darkMode ? "text-white" : "text-gray-800"
                      } mb-2`}
                    >
                      {item.name}
                    </h3>
                    <p
                      className={`${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } mb-2`}
                    >
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-lg font-semibold ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        ₹{item.price}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                      >
                        Add to Cart
                      </button>
                    </div>
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
              } mb-6`}
            >
              Your Cart
            </h2>
            {cart.length === 0 ? (
              <div
                className={`${
                  darkMode
                    ? "bg-gray-800 text-gray-300"
                    : "bg-white text-gray-600"
                } rounded-xl shadow-lg p-6 text-center`}
              >
                Your cart is empty
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className={`${
                      darkMode ? "bg-gray-800" : "bg-white"
                    } rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
                  >
                    <div className="p-6">
                      <h3
                        className={`text-xl font-bold ${
                          darkMode ? "text-white" : "text-gray-800"
                        } mb-2`}
                      >
                        {item.name}
                      </h3>
                      <p
                        className={`${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        } mb-2`}
                      >
                        ₹{item.price}
                      </p>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <div
                  className={`${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } rounded-xl shadow-lg p-6`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`text-lg font-semibold ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Total:
                    </span>
                    <span
                      className={`text-xl font-bold ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      ₹{cart.reduce((total, item) => total + item.price, 0)}
                    </span>
                  </div>
                  <button
                    onClick={handleOrder}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Restaurant;
