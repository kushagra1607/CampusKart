const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const LaundryOrder = require("../models/LaundryOrder");

// Get all laundry items
router.get("/items", async (req, res) => {
  try {
    const items = [
      {
        _id: "1",
        name: "T-Shirt",
        price: 20,
        description: "Regular t-shirts and casual tops",
      },
      {
        _id: "2",
        name: "Pajama",
        price: 20,
        description: "Nightwear and sleepwear",
      },
      {
        _id: "3",
        name: "Jeans",
        price: 30,
        description: "Denim pants and jeans",
      },
      {
        _id: "4",
        name: "Sweater",
        price: 30,
        description: "Woolen sweaters and pullovers",
      },
      {
        _id: "5",
        name: "Kurta",
        price: 30,
        description: "Traditional Indian kurta",
      },
      {
        _id: "6",
        name: "Salwar",
        price: 30,
        description: "Traditional Indian salwar",
      },
      {
        _id: "7",
        name: "Saree",
        price: 40,
        description: "Traditional Indian saree",
      },
      {
        _id: "8",
        name: "Jacket",
        price: 40,
        description: "Winter jackets and coats",
      },
      {
        _id: "9",
        name: "Blanket",
        price: 50,
        description: "Bed blankets and comforters",
      },
    ];
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Place laundry order
router.post("/order", auth, async (req, res) => {
  try {
    const { items, specialInstructions, totalPrice } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items selected" });
    }

    // Calculate total price from items
    const calculatedTotalPrice = items.reduce((total, item) => {
      return total + item.item.price * item.quantity;
    }, 0);

    // Verify the calculated total matches the provided total
    if (calculatedTotalPrice !== totalPrice) {
      return res
        .status(400)
        .json({ message: "Invalid total price calculation" });
    }

    const order = new LaundryOrder({
      user: req.user.id,
      items: items.map((item) => ({
        item: {
          _id: item.item._id,
          name: item.item.title,
          price: item.item.price,
        },
        quantity: item.quantity,
      })),
      specialInstructions,
      totalPrice,
      status: "pending",
      createdAt: new Date(),
    });

    await order.save();
    res.json(order);
  } catch (err) {
    console.error("Error placing laundry order:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's laundry orders
router.get("/orders", auth, async (req, res) => {
  try {
    const orders = await LaundryOrder.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching laundry orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Cancel laundry order
router.put("/orders/:orderId/cancel", auth, async (req, res) => {
  try {
    const order = await LaundryOrder.findOne({
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

    order.status = "cancelled";
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to cancel order" });
  }
});

module.exports = router;
