// Create a Controller for Authentication
const jwt = require("jsonwebtoken");
const User = require("../model/UserSchema");

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// User Registration
exports.register = async (req, res) => {
  try {
    const { username, email, phone, dob, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    console.log(existingUser);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({ username, email, phone, dob, password, role });
    console.log(newUser);
    await newUser.save();
    console.log("New user created:", newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// User Login
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// User Signin
exports.loginViaWeb = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email, password);
    // Find user by email
    const user = await User.findOne({ email });
    console.log("User found:", user);
    if (!user) {
      return res.render("pages/login", { error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log("Password match:", isMatch);
    if (!isMatch) {
      return res.render("pages/login", { error: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user);
    console.log("Generated token:", token);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    res.redirect("/servererror");
  }
};
