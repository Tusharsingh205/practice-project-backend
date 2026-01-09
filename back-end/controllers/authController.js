const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, contact, role } = req.body;

    // Check all required fields
    if (!name || !email || !password || !confirmPassword || !contact || !role) {
      return res.status(400).json({ message: "All fields are required ❌" });
    }

    // Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match ❌" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists ❌" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with hashed password
    const user = await User.create({
      name,
      email,
      password: hashedPassword, // ✅ store hashed password
      contact,
      role,
    });

    // Return response
    res.status(201).json({
      message: "User registered successfully ✅",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        contact: user.contact,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error ❌" });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required ❌" });
    }

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is not register❌",

      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
console.log(user);
     const userWithToken = {
      ...user._doc, // MongoDB object
      token,        // 👈 user ke andar token
    };

      userWithToken.password = undefined; // Hide password
      console.log(userWithToken);
      const option = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, option).status(200).json({
        success: true,
        message: "Login successful ✅",
        userWithToken,
        token,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Password incorrect ❌" });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error ❌" });
  }
};
