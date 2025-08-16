import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    console.log("📩 Incoming signup request:", { username, email });

    if (!username || !email || !password) {
      console.error("❌ Missing fields:", { username, email, password });
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error("❌ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed");

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("✅ User saved in DB:", newUser._id);

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET missing in env");
      return res.status(500).json({ message: "Server misconfigured: JWT_SECRET missing" });
    }

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    console.log("✅ JWT created");

    return res.status(201).json({
      message: "Signup successful",
      token,
      username: newUser.username,
    });
  } catch (err) {
    console.error("🔥 Signup error:", err); // log the full error
    return res.status(500).json({ message: "Signup error", error: err.message });
  }
});


// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.json({
    token,
    user: {
      id: user._id,
      name: user.username,     
      email: user.email    
    }
  });
});

export default router;
