const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  availability: {
    type: Number,
    required: true,
    default: 1,
  },
});

const rentalOrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  item: {
    _id: String,
    title: String,
    price: Number,
    description: String,
  },
  duration: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "active", "completed", "cancelled"],
    default: "pending",
  },
  dueDate: {
    type: Date,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = {
  Rental: mongoose.model("Rental", rentalSchema),
  RentalOrder: mongoose.model("RentalOrder", rentalOrderSchema),
};
