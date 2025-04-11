const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["fiction", "non-fiction", "science", "history", "biography", "technology", "art", "academic", "reference", "periodical"],
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  totalCopies: {
    type: Number,
    required: true,
    min: 0,
  },
  availableCopies: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
  },
  ebookUrl: {
    type: String,
  },
  genre: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const bookIssueSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["issued", "returned", "overdue"],
    default: "issued",
  },
  fine: {
    type: Number,
    default: 0,
  },
});

const Book = mongoose.model("Book", bookSchema);
const BookIssue = mongoose.model("BookIssue", bookIssueSchema);

module.exports = { Book, BookIssue };
