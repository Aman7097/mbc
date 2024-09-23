/**
 * Authentication Controller
 *
 * This module handles user authentication operations including
 * registration, login, Google OAuth, and user profile retrieval.
 */

const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const fetch = require("node-fetch");

/**
 * Generate JWT token for a user
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET || "testsecret", {
    expiresIn: "1d",
  });
};

/**
 * Format user data for response
 * @param {Object} user - User object
 * @returns {Object} Formatted user data
 */
const formatUserResponse = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
});

/**
 * Register a new user
 */
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, userType = "buyer" } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ username, email, password, userType });
    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Authenticate a user and generate a token
 */
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(200).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Authenticate a user and generate a token
 */
exports.logout = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(200).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Authenticate a user and generate a token
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Generate a password reset token (this is a simplified version)
    const resetToken = crypto.randomBytes(20).toString('hex');
    // Set reset token to the database (not shown here) and send an email with the token

    res.status(200).json({ message: "Reset link has been sent to your email.", resetToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Authenticate a user and generate a token
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = newPassword; // Assume hashing occurs within model
    await user.save();
    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Authenticate a user and generate a token
 */
exports.getMyDetails = async (req, res) => {
  try {
    const user = req.user;
    const formattedUser = formatUserResponse(user);
    res.status(200).json({ user: formattedUser });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error" });
  }
};
