/**
 * Buyer Routes
 *
 * This module defines the routes for buyers, including
 * browsing products, placing orders, and reviewing products.
 */

const express = require("express");
const { check } = require("express-validator");
const buyerController = require("../controllers/buyerController.js");
const { authCheck, buyerCheck } = require("../middleware/authMiddleware.js");

const router = express.Router();

/**
 * @route   GET /api/buyer/products
 * @desc    Get list of all products (Buyers can browse)
 * @access  Public
 */
router.get("/products", buyerController.getAllProducts);

/**
 * @route   GET /api/buyer/product/:id
 * @desc    Get details of a specific product
 * @access  Public
 */
router.get("/product/:id", buyerController.getProductById);

/**
 * @route   POST /api/buyer/order
 * @desc    Place an order for a product
 * @access  Private (Buyer only)
 */
router.post(
  "/order",
  authCheck,
  buyerCheck,
  [
    check("productId", "Product ID is required").notEmpty(),
    check("quantity", "Quantity should be a positive number").isInt({ min: 1 }),
  ],
  buyerController.placeOrder
);

/**
 * @route   GET /api/buyer/orders
 * @desc    View all orders made by the logged-in buyer
 * @access  Private (Buyer only)
 */
router.get("/orders", authCheck, buyerCheck, buyerController.getOrders);

module.exports = router;
