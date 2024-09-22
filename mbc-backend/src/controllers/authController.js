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
  firstName: user.firstName,
  lastName: user.lastName,
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

    const { firstName, lastName, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ firstName, lastName, email, password });
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
exports.resetPassword = async (req, res) => {
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
exports.getMyDetails = async (req, res) => {
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
