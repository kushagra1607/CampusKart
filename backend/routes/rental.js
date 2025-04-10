const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { Rental, RentalOrder } = require("../models/Rental");

// Initialize rental items if they don't exist
const initializeRentalItems = async () => {
  try {
    const items = [
      {
        title: "Projector",
        description: "HD Projector for presentations and movie nights",
        price: 200,
        category: "Electronics",
        availability: 3,
        image: "https://example.com/projector.jpg",
      },
      {
        title: "Tent",
        description: "4-person camping tent",
        price: 150,
        category: "Outdoor",
        availability: 2,
        image: "https://example.com/tent.jpg",
      },
      {
        title: "Bicycle",
        description: "Mountain bike for campus commuting",
        price: 100,
        category: "Transport",
        availability: 5,
        image: "https://example.com/bicycle.jpg",
      },
      {
        title: "Camera",
        description: "DSLR camera for photography",
        price: 300,
        category: "Electronics",
        availability: 2,
        image: "https://example.com/camera.jpg",
      },
      {
        title: "Gaming Console",
        description: "Latest gaming console with controllers",
        price: 250,
        category: "Entertainment",
        availability: 1,
        image: "https://example.com/console.jpg",
      },
    ];

    // First, delete all existing items
    await Rental.deleteMany({});
    console.log("Cleared existing rental items");

    // Then create all items with correct availability
    await Rental.insertMany(items);
    console.log("Rental items initialized with correct availability values");
  } catch (err) {
    console.error("Error initializing rental items:", err);
  }
};

// Initialize items on server start
initializeRentalItems();

// Get all rental items
router.get("/items", async (req, res) => {
  try {
    const items = await Rental.find();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Rent an item
router.post("/rent", auth, async (req, res) => {
  try {
    const { itemId, duration } = req.body;

    // Find the item in database
    const item = await Rental.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.availability <= 0) {
      return res.status(400).json({ message: "Item not available" });
    }

    // Update item availability
    item.availability -= 1;
    await item.save();

    // Calculate due date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + duration);

    // Create rental order
    const order = new RentalOrder({
      user: req.user.id,
      item: {
        _id: item._id,
        title: item.title,
        price: item.price,
        description: item.description,
      },
      duration,
      totalPrice: item.price * duration,
      dueDate,
      status: "pending",
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create rental order" });
  }
});

// Get user's rental orders
router.get("/orders", auth, async (req, res) => {
  try {
    const orders = await RentalOrder.find({
      user: req.user.id,
      status: { $ne: "cancelled" }, // Exclude cancelled orders
    }).sort({
      date: -1,
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Cancel rental order
router.put("/orders/:orderId/cancel", auth, async (req, res) => {
  try {
    const order = await RentalOrder.findOne({
      _id: req.params.orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending orders can be cancelled" });
    }

    // Update the order status
    order.status = "cancelled";
    await order.save();

    // Increment item availability
    const item = await Rental.findById(order.item._id);
    if (item) {
      item.availability += 1;
      await item.save();
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to cancel order" });
  }
});

module.exports = router;
