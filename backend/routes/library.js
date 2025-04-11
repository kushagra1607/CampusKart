const express = require("express");
const router = express.Router();
const { Book, BookIssue } = require("../models/Library");
const { auth } = require("../middleware/auth");

// Get all books
router.get("/books", async (req, res) => {
  try {
    const { category } = req.query;
    
    if (category) {
      const books = await Book.find({ category });
      res.json(books);
    } else {
      const books = await Book.find();
      res.json(books);
    }
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's book issues
router.get("/issues", auth, async (req, res) => {
  try {
    const issues = await BookIssue.find({ user: req.user.id, status: "issued" })
      .populate("book", "title author isbn description location")
      .sort({ issueDate: -1 });
    res.json(issues);
  } catch (err) {
    console.error("Error fetching user's book issues:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Search books
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { isbn: { $regex: query, $options: "i" } },
      ],
    });
    res.json(books);
  } catch (err) {
    console.error("Error searching books:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Issue a book (protected route)
router.post("/issue", auth, async (req, res) => {
  try {
    const { bookId } = req.body;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "Book not available" });
    }

    // Check if user already has this book issued
    const existingIssue = await BookIssue.findOne({
      user: req.user.id,
      book: bookId,
      status: "issued",
    });
    if (existingIssue) {
      return res
        .status(400)
        .json({ message: "You already have this book issued" });
    }

    // Calculate due date (14 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    // Create book issue
    const bookIssue = new BookIssue({
      user: req.user.id,
      book: bookId,
      dueDate,
    });

    // Update available copies
    book.availableCopies -= 1;
    await book.save();
    await bookIssue.save();

    // Populate book details in the response
    const populatedIssue = await BookIssue.findById(bookIssue._id).populate(
      "book",
      "title author isbn description location"
    );

    res.json(populatedIssue);
  } catch (err) {
    console.error("Error issuing book:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Return a book (protected route)
router.post("/return/:issueId", auth, async (req, res) => {
  try {
    const bookIssue = await BookIssue.findById(req.params.issueId).populate(
      "book"
    );

    if (!bookIssue) {
      return res.status(404).json({ message: "Book issue not found" });
    }

    // Check if the book belongs to the user
    if (bookIssue.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update book issue
    bookIssue.returnDate = new Date();
    bookIssue.status = "returned";

    // Calculate fine if overdue
    if (bookIssue.returnDate > bookIssue.dueDate) {
      const daysOverdue = Math.ceil(
        (bookIssue.returnDate - bookIssue.dueDate) / (1000 * 60 * 60 * 24)
      );
      bookIssue.fine = daysOverdue * 5; // ₹5 per day fine
    }

    // Update available copies
    const book = await Book.findById(bookIssue.book);
    book.availableCopies += 1;
    await book.save();
    await bookIssue.save();

    res.json(bookIssue);
  } catch (err) {
    console.error("Error returning book:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE endpoint to return a book
router.delete("/issue/:bookId", auth, async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user._id;

  try {
    console.log(
      "DELETE request received for bookId:",
      bookId,
      "by userId:",
      userId
    );

    // Find the issued book record
    const bookIssue = await BookIssue.findOne({
      book: bookId,
      user: userId,
      status: "issued",
    });

    if (!bookIssue) {
      console.log(
        "No book issue record found for bookId:",
        bookId,
        "and userId:",
        userId
      );
      return res.status(404).json({ message: "Book issue record not found." });
    }

    console.log("Book issue record found:", bookIssue);

    // Update the book issue record
    bookIssue.status = "returned";
    bookIssue.returnDate = new Date();
    await bookIssue.save();

    // Update the book's available copies
    const book = await Book.findById(bookId);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    console.log("Book returned successfully:", book);
    res.json({ message: "Book returned successfully." });
  } catch (error) {
    console.error("Error returning book:", error);
    res
      .status(500)
      .json({ message: "Failed to return book. Please try again." });
  }
});

// Get user's issued books (protected route)
router.get("/my-books", auth, async (req, res) => {
  try {
    console.log("Fetching issued books for user:", req.user.id);
    const bookIssues = await BookIssue.find({
      user: req.user.id,
      status: "issued", // Only return currently issued books
    })
      .populate("book", "title author isbn description genre") // Ensure all necessary fields are populated
      .sort({ issueDate: -1 });

    console.log("Fetched book issues:", bookIssues);
    res.json(bookIssues);
  } catch (err) {
    console.error("Error fetching user's books:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single book by ID
router.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (err) {
    console.error("Error fetching book:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
