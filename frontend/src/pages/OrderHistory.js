import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DarkModeContext } from "../App";
import { SkeletonCards } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import usePageTitle from "../hooks/usePageTitle";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  preparing: "bg-blue-100 text-blue-800 border-blue-300",
  ready: "bg-purple-100 text-purple-800 border-purple-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

function OrderHistory() {
  const { user } = useAuth();
  const { darkMode } = useContext(DarkModeContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  usePageTitle("My Orders");

  useEffect(() => {
    let active = true;
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/restaurant/orders");
        if (active) {
          setOrders(res.data || []);
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setError("Failed to load your orders");
          setLoading(false);
        }
      }
    };
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
    return () => {
      active = false;
    };
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          icon="🔒"
          title="Please log in"
          subtitle="You need to be logged in to view your order history."
          action={
            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Go to Login
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 to-gray-100"
      } py-12`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1
          className={`text-4xl font-extrabold mb-2 text-center ${
            darkMode
              ? "text-white"
              : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
          }`}
        >
          My Orders
        </h1>
        <p
          className={`text-center mb-10 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Track all your restaurant orders
        </p>

        {error && (
          <div className="bg-red-500 text-white p-4 mb-6 rounded-lg text-center">
            {error}
          </div>
        )}

        {loading ? (
          <SkeletonCards count={3} />
        ) : orders.length === 0 ? (
          <EmptyState
            icon="🍽️"
            title="No orders yet"
            subtitle="When you place an order from the restaurant, it will show up here."
            action={
              <Link
                to="/restaurant"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Browse Menu
              </Link>
            }
          />
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className={`rounded-xl shadow-lg p-6 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                  <div>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${
                      STATUS_STYLES[order.status] || STATUS_STYLES.pending
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div
                  className={`divide-y ${
                    darkMode ? "divide-gray-700" : "divide-gray-100"
                  }`}
                >
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between py-2 text-sm"
                    >
                      <span
                        className={darkMode ? "text-gray-300" : "text-gray-700"}
                      >
                        {item.menuItem ? item.menuItem.name : "Item"} ×{" "}
                        {item.quantity}
                      </span>
                      <span
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {order.specialInstructions && (
                  <p
                    className={`mt-3 text-sm italic ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Note: {order.specialInstructions}
                  </p>
                )}

                <div
                  className={`flex justify-between items-center mt-4 pt-4 border-t ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <span
                    className={`font-semibold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Total
                  </span>
                  <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    ₹{order.totalPrice}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;
