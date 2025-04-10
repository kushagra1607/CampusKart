const express = require("express");
const router = express.Router();
const { MenuItem, Order } = require("../models/Restaurant");
const { auth } = require("../middleware/auth");

// Get all menu items
router.get("/menu", async (req, res) => {
  try {
    console.log("Fetching menu items from the database...");
    const menuItems = await MenuItem.find();
    console.log("Fetched menu items:", menuItems);
    res.json(menuItems);
  } catch (err) {
    console.error("Error fetching menu items:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get menu items by category
router.get("/menu/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const menuItems = await MenuItem.find({ category });
    res.json(menuItems);
  } catch (err) {
    console.error("Error fetching menu items by category:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Place an order (protected route)
router.post("/order", auth, async (req, res) => {
  try {
    const { items, specialInstructions } = req.body;
    let totalPrice = 0;

    // Calculate total price and validate items
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res
          .status(400)
          .json({ message: `Item not found: ${item.menuItem}` });
      }
      if (!menuItem.availability) {
        return res
          .status(400)
          .json({ message: `Item not available: ${menuItem.name}` });
      }
      totalPrice += menuItem.price * item.quantity;
    }

    // Create order
    const order = new Order({
      user: req.user.id,
      items: items.map((item) => ({
        menuItem: item.menuItem,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice,
      specialInstructions: specialInstructions || "",
    });

    await order.save();
    res.json(order);
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's orders (protected route)
router.get("/orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.menuItem", "name price")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get order details (protected route)
router.get("/order/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.menuItem",
      "name price"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order belongs to the user
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (err) {
    console.error("Error fetching order details:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
