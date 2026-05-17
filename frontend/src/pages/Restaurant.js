import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DarkModeContext } from "../App";
import { SkeletonCards } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";

function Restaurant() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const { user } = useAuth();
  const { darkMode } = useContext(DarkModeContext);

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
        const response = await axios.get("/api/restaurant/menu");
        setMenu(response.data || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch menu");
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Remove duplicate items by name
  const uniqueMenu = menu.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.name === item.name)
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredItems = uniqueMenu.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" ? true : item.category === selectedCategory;
    const name = (item.name || "").toLowerCase();
    const description = (item.description || "").toLowerCase();
    const matchesSearch =
      normalizedQuery === ""
        ? true
        : name.includes(normalizedQuery) ||
          description.includes(normalizedQuery);
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c._id === item._id);
      if (existing) {
        return prev.map((c) =>
          c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setSuccess(`${item.name} added to cart!`);
    setTimeout(() => setSuccess(""), 2500);
  };

  const changeQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c._id === id ? { ...c, quantity: c.quantity + delta } : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((c) => c._id !== id));
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
        quantity: item.quantity,
        price: item.price,
      }));

      const response = await axios.post("/api/restaurant/order", {
        items: orderItems,
        totalPrice: cartTotal,
        specialInstructions: specialInstructions || "",
      });

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

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 to-gray-100"
      } py-12`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1
            className={`text-4xl font-extrabold ${
              darkMode
                ? "text-white"
                : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
            } mb-3`}
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
              } px-8 py-4 rounded-lg shadow-lg`}
            >
              <span className="font-semibold">✓ {success}</span>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes..."
            className={`w-full max-w-md px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
            }`}
          />
        </div>

        {/* Category Filter */}
        <div className="flex space-x-3 mb-8 overflow-x-auto pb-2 justify-center flex-wrap gap-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full capitalize transition-all ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : darkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Menu */}
          <div>
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              } mb-6`}
            >
              Menu
            </h2>
            {loading ? (
              <SkeletonCards count={4} />
            ) : filteredItems.length === 0 ? (
              <EmptyState
                icon="🔍"
                title="No dishes found"
                subtitle="Try a different search or category."
              />
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className={`${
                      darkMode ? "bg-gray-800" : "bg-white"
                    } rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                  >
                    <div className="p-6">
                      <img
                        src={`${item.image}`}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/400x300?text=No+Image";
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
                        } mb-3`}
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
            )}
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
              <EmptyState
                icon="🛒"
                title="Your cart is empty"
                subtitle="Add some delicious meals from the menu to get started."
              />
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className={`${
                      darkMode ? "bg-gray-800" : "bg-white"
                    } rounded-xl shadow-lg p-5`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3
                          className={`text-lg font-bold ${
                            darkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {item.name}
                        </h3>
                        <p
                          className={
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }
                        >
                          ₹{item.price} each
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-600 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => changeQuantity(item._id, -1)}
                          className={`w-8 h-8 rounded-full font-bold ${
                            darkMode
                              ? "bg-gray-700 text-white hover:bg-gray-600"
                              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          }`}
                        >
                          −
                        </button>
                        <span
                          className={`font-semibold w-6 text-center ${
                            darkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => changeQuantity(item._id, 1)}
                          className={`w-8 h-8 rounded-full font-bold ${
                            darkMode
                              ? "bg-gray-700 text-white hover:bg-gray-600"
                              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          }`}
                        >
                          +
                        </button>
                      </div>
                      <span
                        className={`font-bold ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}

                <div
                  className={`${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } rounded-xl shadow-lg p-6`}
                >
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Special instructions (optional)"
                    rows={2}
                    className={`w-full mb-4 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                    }`}
                  />
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`text-lg font-semibold ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Total:
                    </span>
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      ₹{cartTotal}
                    </span>
                  </div>
                  {!user && (
                    <p
                      className={`text-sm mb-3 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Please{" "}
                      <Link
                        to="/login"
                        className="text-blue-500 hover:underline"
                      >
                        log in
                      </Link>{" "}
                      to place an order.
                    </p>
                  )}
                  <button
                    onClick={handleOrder}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 font-medium"
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
