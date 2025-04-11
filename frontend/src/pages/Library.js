import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { DarkModeContext } from "../App";

function Library() {
  const [books, setBooks] = useState([]);
  const [userBooks, setUserBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const { user } = useAuth();
  const { darkMode } = useContext(DarkModeContext);

  const genres = [
    "all",
    "fiction",
    "non-fiction",
    "science",
    "history",
    "biography",
    "technology",
    "art",
  ];

  // Update the fetchBookCover function to use a fixed image for National Geographic
  const fetchBookCover = (isbn, title) => {
    console.log("Fetching cover for:", { isbn, title });
    if (title.toLowerCase() === "national geographic") {
      console.log("Using fixed image for National Geographic");
      return "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400";
    }
    if (!isbn) {
      console.log("No ISBN provided, using placeholder image");
      return "https://picsum.photos/200/300?text=No+Image";
    }
    const url = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
    console.log("Generated URL:", url);
    return url;
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/library/books"
        );
        setBooks(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to fetch books");
        setLoading(false);
      }
    };

    const fetchUserBooks = async () => {
      if (user) {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/library/my-books",
            {
              headers: { Authorization: `Bearer ${user.token}` },
            }
          );
          setUserBooks(response.data || []);
        } catch (err) {
          console.error("Error fetching user books:", err);
        }
      }
    };

    fetchBooks();
    fetchUserBooks();
  }, [user]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleIssueBook = async (bookId) => {
    if (!user) {
      setError("Please login to issue a book");
      return;
    }

    try {
      setError("");
      const response = await axios.post(
        "http://localhost:5000/api/library/issue",
        { bookId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setSuccess("Book issued successfully!");
        // Refresh both available books and user's books
        const [booksResponse, userBooksResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/library/books"),
          axios.get("http://localhost:5000/api/library/my-books", {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);
        setBooks(booksResponse.data || []);
        setUserBooks(userBooksResponse.data || []);
      }
    } catch (err) {
      console.error("Issue error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to issue book. Please try again.");
      }
    }
  };

  const handleReturnBook = async (bookIssueId, bookId) => {
    if (!user) {
      setError("Please login to return a book");
      return;
    }

    try {
      setError("");
      const response = await axios.delete(
        `http://localhost:5000/api/library/issue/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setSuccess("Book returned successfully!");
        // Refresh both available books and user's books
        const [booksResponse, userBooksResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/library/books"),
          axios.get("http://localhost:5000/api/library/my-books", {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);
        setBooks(booksResponse.data || []);
        setUserBooks(userBooksResponse.data || []);
      }
    } catch (err) {
      console.error("Return error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to return book. Please try again.");
      }
    }
  };

  // Filter the books based on selected genre
  const filteredBooks =
    selectedGenre === "all"
      ? books
      : books.filter((book) => book.category === selectedGenre);

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
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-500 text-white p-4 mb-6 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500 text-white p-4 mb-6 rounded-lg">
            {success}
          </div>
        )}

        <h1
          className={`text-4xl font-bold text-center mb-12 ${
            darkMode
              ? "text-gradient-to-r from-purple-400 to-pink-400"
              : "text-gradient-to-r from-purple-600 to-pink-600"
          }`}
        >
          Library
        </h1>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedGenre === genre
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold"
                    : darkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Available Books */}
          <div>
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              } mb-6`}
            >
              Available Books
            </h2>
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div
                className={`${
                  darkMode
                    ? "bg-gray-800 text-gray-300"
                    : "bg-white text-gray-600"
                } rounded-xl shadow-lg p-6 text-center`}
              >
                No books found in this category
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredBooks.map((book) =>
                  book ? (
                    <div
                      key={book._id}
                      className={`${
                        darkMode ? "bg-gray-800" : "bg-white"
                      } rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
                      style={{
                        perspective: "1000px",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <div className="p-6">
                        <img
                          src={fetchBookCover(book.isbn, book.title)}
                          alt={book.title || "No Title"}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://picsum.photos/200/300?text=No+Image";
                          }}
                        />
                        <h3
                          className={`text-2xl font-bold ${
                            darkMode ? "text-white" : "text-gray-800"
                          } mb-2`}
                        >
                          {book.title || "Unknown Title"}
                        </h3>
                        <p
                          className={`${
                            darkMode ? "text-gray-300" : "text-gray-600"
                          } mb-2`}
                        >
                          by {book.author || "Unknown Author"}
                        </p>
                        <p
                          className={`${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          } mb-4`}
                        >
                          {book.description || "No description available."}
                        </p>
                        <div className="flex flex-col space-y-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              darkMode
                                ? "bg-blue-900 text-blue-200"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {book.category && 
                              book.category.charAt(0).toUpperCase() + 
                              book.category.slice(1) || 
                              "Unknown Category"}
                          </span>
                          {book.genre && (
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                darkMode
                                  ? "bg-purple-900 text-purple-200"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {book.genre}
                            </span>
                          )}
                          <div className="flex space-x-2">
                            {book.availableCopies > 0 ? (
                              <button
                                onClick={() => handleIssueBook(book._id)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                              >
                                Issue Book
                              </button>
                            ) : (
                              <button
                                disabled
                                className="bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed"
                              >
                                Not Available
                              </button>
                            )}
                            {book.ebookUrl && (
                              <button
                                onClick={() => window.open(book.ebookUrl, '_blank')}
                                className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
                              >
                                Read Online
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}
          </div>

          {/* My Books */}
          <div>
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              } mb-6`}
            >
              My Books
            </h2>
            {userBooks.length === 0 ? (
              <div
                className={`${
                  darkMode
                    ? "bg-gray-800 text-gray-300"
                    : "bg-white text-gray-600"
                } rounded-xl shadow-lg p-6 text-center`}
              >
                You haven't issued any books yet
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {userBooks.map((issue) =>
                  issue.book ? (
                    <div
                      key={issue._id}
                      className={`${
                        darkMode ? "bg-gray-800" : "bg-white"
                      } rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
                      style={{
                        perspective: "1000px",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <div className="p-6">
                        <img
                          src={fetchBookCover(
                            issue.book.isbn,
                            issue.book.title
                          )}
                          alt={issue.book.title || "No Title"}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://picsum.photos/200/300?text=No+Image";
                          }}
                        />
                        <h3
                          className={`text-2xl font-bold ${
                            darkMode ? "text-white" : "text-gray-800"
                          } mb-2`}
                        >
                          {issue.book.title || "Unknown Title"}
                        </h3>
                        <p
                          className={`${
                            darkMode ? "text-gray-300" : "text-gray-600"
                          } mb-2`}
                        >
                          by {issue.book.author || "Unknown Author"}
                        </p>
                        <p
                          className={`${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          } mb-4`}
                        >
                          {issue.book.description ||
                            "No description available."}
                        </p>
                        <div className="flex justify-between items-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              darkMode
                                ? "bg-blue-900 text-blue-200"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {issue.book.category && 
                              issue.book.category.charAt(0).toUpperCase() + 
                              issue.book.category.slice(1) || 
                              "Unknown Category"}
                          </span>
                          {issue.book.genre && (
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                darkMode
                                  ? "bg-purple-900 text-purple-200"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {issue.book.genre}
                            </span>
                          )}
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleReturnBook(issue._id, issue.book._id)
                              }
                              className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
                            >
                              Return Book
                            </button>
                            {issue.book.ebookUrl && (
                              <button
                                onClick={() => window.open(issue.book.ebookUrl, '_blank')}
                                className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
                              >
                                Read Online
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Library;
