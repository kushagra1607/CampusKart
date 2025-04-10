const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const authRoutes = require("./routes/auth");
const rentalRoutes = require("./routes/rental");
const laundryRoutes = require("./routes/laundry");
const restaurantRoutes = require("./routes/restaurant");
const libraryRoutes = require("./routes/library");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the frontend public directory
app.use('/images', express.static(path.resolve(__dirname, '../frontend/public/images')));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/campuskart", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "CampusKart API is running!" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rental", rentalRoutes);
app.use("/api/laundry", laundryRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/library", libraryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
