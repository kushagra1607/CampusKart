const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

// Temporary storage for verification codes (in production, use a proper database or cache)
const verificationCodes = {};

// Register user
router.post("/register", async (req, res) => {
  try {
    const { name, mobile, password, rollNo, hostel, roomNo } = req.body;
    console.log("Registration attempt with data:", {
      name,
      mobile,
      rollNo,
      hostel,
      roomNo,
      passwordLength: password ? password.length : 0,
    });

    // Validate required fields
    if (!name || !mobile || !password || !rollNo || !hostel || !roomNo) {
      console.log("Missing required fields");
      return res.status(400).json({
        message: "All fields are required",
        missingFields: {
          name: !name,
          mobile: !mobile,
          password: !password,
          rollNo: !rollNo,
          hostel: !hostel,
          roomNo: !roomNo,
        },
      });
    }

    // Check if user already exists
    let user = await User.findOne({ mobile });
    if (user) {
      console.log("User already exists with mobile:", mobile);
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    user = new User({
      name,
      mobile,
      password,
      rollNo,
      hostel,
      roomNo,
    });

    // Save user
    await user.save();
    console.log("New user created successfully:", {
      id: user._id,
      mobile: user.mobile,
    });

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          console.error("JWT signing error:", err);
          throw err;
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.error("Registration error:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;
    console.log("Login attempt for mobile:", mobile);

    // Check if user exists
    const user = await User.findOne({ mobile });
    if (!user) {
      console.log("No user found with mobile:", mobile);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("User found:", user.name);
    console.log("Stored password hash:", user.password);
    console.log("Input password:", password);

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.log("Password mismatch for user:", user.name);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    // User is already attached to req by the auth middleware
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Send verification code for password reset
router.post("/send-verification", async (req, res) => {
  try {
    const { mobile } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(400).json({ message: "User not found with this mobile number" });
    }
    
    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In a real app, you would send this code via SMS
    console.log(`Verification code for ${mobile}: ${verificationCode}`);
    
    // Store the code with expiration time (30 minutes)
    verificationCodes[mobile] = {
      code: verificationCode,
      expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes in milliseconds
    };
    
    // Include the verification code in the response for testing purposes
    // In a production environment, this would NOT be included - only sent via SMS
    res.json({ 
      message: "Verification code sent successfully", 
      verificationCode: verificationCode, // Only for testing purposes!
      testMode: true
    });
  } catch (err) {
    console.error("Send verification error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Verify the code entered by user
router.post("/verify-code", async (req, res) => {
  try {
    const { mobile, verificationCode } = req.body;
    
    // Check if the verification code exists and is valid
    const storedVerification = verificationCodes[mobile];
    
    if (!storedVerification) {
      return res.status(400).json({ message: "No verification code found. Please request a new one." });
    }
    
    if (Date.now() > storedVerification.expiresAt) {
      // Remove expired code
      delete verificationCodes[mobile];
      return res.status(400).json({ message: "Verification code has expired. Please request a new one." });
    }
    
    if (storedVerification.code !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }
    
    // Code is valid
    res.json({ message: "Verification successful" });
  } catch (err) {
    console.error("Verify code error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Reset password with verified code
router.post("/reset-password", async (req, res) => {
  try {
    const { mobile, verificationCode, newPassword } = req.body;
    
    // Verify the code again
    const storedVerification = verificationCodes[mobile];
    
    if (!storedVerification) {
      return res.status(400).json({ message: "No verification code found. Please restart the process." });
    }
    
    if (Date.now() > storedVerification.expiresAt) {
      // Remove expired code
      delete verificationCodes[mobile];
      return res.status(400).json({ message: "Verification code has expired. Please restart the process." });
    }
    
    if (storedVerification.code !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }
    
    // Find the user
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    
    // Set the new password (the User model's pre-save hook will hash it)
    user.password = newPassword;
    
    // Log for debugging
    console.log("Resetting password for user:", user.name);
    
    // Save the user with new password
    await user.save();
    
    // Remove the verification code
    delete verificationCodes[mobile];
    
    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
