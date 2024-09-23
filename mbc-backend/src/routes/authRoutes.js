/**
 * Authentication Routes
 *
 * This module defines the routes for user authentication,
 * including registration, login, logout, password management, and user profile retrieval.
 */

const express = require("express");
const { check } = require("express-validator");
const authController = require("../controllers/authController.js");
const { authCheck } = require("../middleware/authMiddleware.js");

const router = express.Router();

/**
 * Validation middleware for registration
 */
const registerValidation = [
  check("username", "User Name is required").notEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password must be at least 8 characters").isLength({
    min: 8,
  }),
];

/**
 * Validation middleware for login
 */
const loginValidation = [
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
];

/**
 * Validation middleware for password reset
 */
const forgotPasswordValidation = [
  check("email", "Please include a valid email").isEmail(),
];

const resetPasswordValidation = [
  check("password", "Password must be at least 8 characters").isLength({
    min: 8,
  }),
];

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", registerValidation, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post("/login", loginValidation, authController.login);

/**
 * @route   GET /api/auth/logout
 * @desc    Logout user and clear token
 * @access  Private (User must be authenticated)
 */
router.get("/logout", authCheck, authController.logout);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Sends a password reset link to the user's email
 * @access  Public
 */
router.post(
  "/forgot-password",
  forgotPasswordValidation,
  authController.forgotPassword
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Resets user's password using the token
 * @access  Public
 */
router.post(
  "/reset-password",
  resetPasswordValidation,
  authController.resetPassword
);

/**
 * @route   GET /api/auth/myDetails
 * @desc    Get current authenticated user's profile
 * @access  Private
 */
router.get("/myDetails", authCheck, authController.getMyDetails);

module.exports = router;
