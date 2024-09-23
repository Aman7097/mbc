/**
 * Admin Routes
 *
 * This module defines the routes for admin interfaces
 * including uploading new products, adding categories, and managing sellers and users.
 */

const express = require("express");
const adminController = require("../controllers/adminController.js");
const { authCheck, adminCheck } = require("../middleware/authMiddleware.js");

const router = express.Router();

/**
 * @route   POST /api/admin/create-category
 * @desc    Create a new category (Admin only)
 * @access  Private (Admin)
 */
router.post(
  "/create-category",
  authCheck,
  adminCheck,
  adminController.createCategory
);

/**
 * @route   POST /api/admin/add-seller
 * @desc    Add a new seller (Admin only)
 * @access  Private (Admin)
 */
router.post("/add-seller", authCheck, adminCheck, adminController.addSeller);

/**
 * @route   GET /api/admin/all-users
 * @desc    Get a list of all users (Admin only)
 * @access  Private (Admin)
 */
router.get("/all-users", authCheck, adminCheck, adminController.getAllUsers);

/**
 * @route   DELETE /api/admin/delete-user
 * @desc    Delete a user (Admin only)
 * @access  Private (Admin)
 */
router.delete(
  "/delete-user/:id",
  authCheck,
  adminCheck,
  adminController.deleteUser
);

module.exports = router;
