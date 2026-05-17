const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { MenuItem } = require("../models/Restaurant");
const { Book } = require("../models/Library");
const { Rental } = require("../models/Rental");

// NOTE: For this demo, any authenticated user may use the admin endpoints.
// In production you would additionally check an isAdmin flag on req.user
// (e.g. `if (!req.user.isAdmin) return res.status(403).json({ message: "Forbidden" });`).

/* ===================== MENU ===================== */

// Get all menu items
router.get("/menu", auth, async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    console.error("Get menu error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create a menu item
router.post("/menu", auth, async (req, res) => {
  try {
    const { name, description, price, category, image, availability } = req.body;
    const item = new MenuItem({
      name,
      description,
      price,
      category,
      image,
      availability,
    });
    await item.save();
    res.json(item);
  } catch (err) {
    console.error("Create menu item error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update a menu item
router.put("/menu/:id", auth, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(item);
  } catch (err) {
    console.error("Update menu item error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a menu item
router.delete("/menu/:id", auth, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete menu item error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ===================== BOOKS ===================== */

// Get all books
router.get("/books", auth, async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.error("Get books error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create a book
router.post("/books", auth, async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      category,
      description,
      location,
      totalCopies,
      availableCopies,
      image,
      ebookUrl,
      genre,
    } = req.body;

    // Validate required fields
    if (!title || !author || !isbn || !category || totalCopies === undefined) {
      return res.status(400).json({
        message: "title, author, isbn, category and totalCopies are required",
      });
    }

    const book = new Book({
      title,
      author,
      isbn,
      category,
      description,
      location,
      totalCopies,
      // Default availableCopies to totalCopies when not provided
      availableCopies:
        availableCopies !== undefined ? availableCopies : totalCopies,
      image,
      ebookUrl,
      genre,
    });
    await book.save();
    res.json(book);
  } catch (err) {
    console.error("Create book error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update a book
router.put("/books/:id", auth, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (err) {
    console.error("Update book error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a book
router.delete("/books/:id", auth, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete book error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ===================== RENTALS ===================== */

// Get all rental items
router.get("/rentals", auth, async (req, res) => {
  try {
    const rentals = await Rental.find();
    res.json(rentals);
  } catch (err) {
    console.error("Get rentals error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create a rental item
router.post("/rentals", auth, async (req, res) => {
  try {
    const { title, description, price, image, category, availability } =
      req.body;
    const rental = new Rental({
      title,
      description,
      price,
      image,
      category,
      availability,
    });
    await rental.save();
    res.json(rental);
  } catch (err) {
    console.error("Create rental error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update a rental item
router.put("/rentals/:id", auth, async (req, res) => {
  try {
    const rental = await Rental.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }
    res.json(rental);
  } catch (err) {
    console.error("Update rental error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a rental item
router.delete("/rentals/:id", auth, async (req, res) => {
  try {
    const rental = await Rental.findByIdAndDelete(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete rental error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
