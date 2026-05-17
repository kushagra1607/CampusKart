import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DarkModeContext } from "../App";
import EmptyState from "../components/EmptyState";
import { SkeletonCards } from "../components/Skeleton";
import usePageTitle from "../hooks/usePageTitle";

// Field config drives the add/edit form for each resource
const RESOURCES = {
  menu: {
    label: "Menu Items",
    endpoint: "/api/admin/menu",
    titleField: "name",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "description", label: "Description", type: "text" },
      { key: "price", label: "Price (₹)", type: "number" },
      {
        key: "category",
        label: "Category",
        type: "select",
        options: ["breakfast", "lunch", "dinner", "snacks", "beverages"],
      },
      { key: "image", label: "Image URL/path", type: "text" },
      { key: "availability", label: "Available", type: "checkbox" },
    ],
  },
  books: {
    label: "Books",
    endpoint: "/api/admin/books",
    titleField: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "author", label: "Author", type: "text" },
      { key: "isbn", label: "ISBN", type: "text" },
      {
        key: "category",
        label: "Category",
        type: "select",
        options: [
          "fiction",
          "non-fiction",
          "science",
          "history",
          "biography",
          "technology",
          "art",
          "academic",
          "reference",
          "periodical",
        ],
      },
      { key: "description", label: "Description", type: "text" },
      { key: "location", label: "Shelf Location", type: "text" },
      { key: "totalCopies", label: "Total Copies", type: "number" },
      { key: "availableCopies", label: "Available Copies", type: "number" },
      { key: "image", label: "Cover Image URL", type: "text" },
      { key: "ebookUrl", label: "Read Online URL", type: "text" },
      { key: "genre", label: "Genre", type: "text" },
      { key: "availableAtIITP", label: "Available at IIT Patna", type: "checkbox" },
    ],
  },
  rentals: {
    label: "Rentals",
    endpoint: "/api/admin/rentals",
    titleField: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "text" },
      { key: "price", label: "Price (₹)", type: "number" },
      { key: "image", label: "Image URL", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "availability", label: "Units Available", type: "number" },
    ],
  },
};

function emptyForm(resourceKey) {
  const form = {};
  RESOURCES[resourceKey].fields.forEach((f) => {
    form[f.key] = f.type === "checkbox" ? false : "";
  });
  return form;
}

function Admin() {
  const { user } = useAuth();
  const { darkMode } = useContext(DarkModeContext);
  usePageTitle("Admin Panel");

  const [tab, setTab] = useState("menu");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(emptyForm("menu"));
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const resource = RESOURCES[tab];

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(RESOURCES[tab].endpoint);
      setItems(res.data || []);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    if (user) {
      fetchItems();
    } else {
      setLoading(false);
    }
  }, [user, fetchItems]);

  const switchTab = (key) => {
    setTab(key);
    setForm(emptyForm(key));
    setEditingId(null);
    setShowForm(false);
    setMessage("");
    setError("");
  };

  const startAdd = () => {
    setForm(emptyForm(tab));
    setEditingId(null);
    setShowForm(true);
  };

  const startEdit = (item) => {
    const filled = emptyForm(tab);
    resource.fields.forEach((f) => {
      if (item[f.key] !== undefined && item[f.key] !== null) {
        filled[f.key] = item[f.key];
      }
    });
    setForm(filled);
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      if (editingId) {
        await axios.put(`${resource.endpoint}/${editingId}`, form);
        setMessage("Item updated successfully");
      } else {
        await axios.post(resource.endpoint, form);
        setMessage("Item added successfully");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm(tab));
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    setMessage("");
    setError("");
    try {
      await axios.delete(`${resource.endpoint}/${id}`);
      setMessage("Item deleted");
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          icon="🔒"
          title="Admin access requires login"
          subtitle="Please log in to manage menu, books and rentals."
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

  const inputClass = `w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white focus:ring-purple-500"
      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
  }`;

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 to-gray-100"
      } py-12`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1
          className={`text-4xl font-extrabold mb-2 text-center ${
            darkMode
              ? "text-white"
              : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
          }`}
        >
          Admin Panel
        </h1>
        <p
          className={`text-center mb-8 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Manage menu items, books and rental inventory
        </p>

        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {Object.keys(RESOURCES).map((key) => (
            <button
              key={key}
              onClick={() => switchTab(key)}
              className={`px-5 py-2 rounded-full font-medium capitalize transition-all ${
                tab === key
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : darkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {RESOURCES[key].label}
            </button>
          ))}
        </div>

        {message && (
          <div className="bg-green-500 text-white p-3 mb-4 rounded-lg text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-500 text-white p-3 mb-4 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="flex justify-end mb-4">
          <button
            onClick={startAdd}
            className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 px-5 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition-all"
          >
            + Add New
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className={`rounded-2xl shadow-lg p-6 mb-8 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2
              className={`text-xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {editingId ? "Edit" : "Add"} {resource.label.replace(/s$/, "")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resource.fields.map((f) => (
                <div
                  key={f.key}
                  className={f.type === "checkbox" ? "flex items-center" : ""}
                >
                  {f.type === "checkbox" ? (
                    <label
                      className={`flex items-center gap-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(form[f.key])}
                        onChange={(e) => handleField(f.key, e.target.checked)}
                        className="h-4 w-4"
                      />
                      {f.label}
                    </label>
                  ) : (
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {f.label}
                      </label>
                      {f.type === "select" ? (
                        <select
                          className={inputClass}
                          value={form[f.key]}
                          onChange={(e) => handleField(f.key, e.target.value)}
                          required
                        >
                          <option value="">Select...</option>
                          {f.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={f.type}
                          className={inputClass}
                          value={form[f.key]}
                          onChange={(e) =>
                            handleField(
                              f.key,
                              f.type === "number"
                                ? Number(e.target.value)
                                : e.target.value
                            )
                          }
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                {editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className={`py-2 px-6 rounded-lg font-medium transition-all ${
                  darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <SkeletonCards count={6} />
        ) : items.length === 0 ? (
          <EmptyState
            icon="📦"
            title={`No ${resource.label.toLowerCase()} yet`}
            subtitle="Use the Add New button to create one."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <div
                key={item._id}
                className={`rounded-xl shadow-lg p-5 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3
                  className={`text-lg font-bold mb-1 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {item[resource.titleField]}
                </h3>
                {item.category && (
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs mb-2 ${
                      darkMode
                        ? "bg-blue-900 text-blue-200"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {item.category}
                  </span>
                )}
                {item.price !== undefined && (
                  <p
                    className={`text-sm mb-3 ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    ₹{item.price}
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="flex-1 bg-blue-600 text-white py-1.5 rounded-lg text-sm hover:bg-blue-700 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex-1 bg-red-600 text-white py-1.5 rounded-lg text-sm hover:bg-red-700 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
