/**
 * Seller Routes
 *
 * This module defines the routes for sellers, including
 * managing products, viewing orders, and handling stock.
 */

const express = require("express");
const { check } = require("express-validator");
const sellerController = require("../controllers/sellerController.js");
const { authCheck, sellerCheck } = require("../middleware/authMiddleware.js");

const router = express.Router();

/**
 * @route   POST /api/seller/product
 * @desc    Add a new product for sale
 * @access  Private (Seller only)
 */
router.post(
  "/product",
  authCheck,
  sellerCheck,
  [
    check("name", "Product name is required").notEmpty(),
    check("description", "Description is required").notEmpty(),
    check("price", "Price must be a positive number").isFloat({ min: 0 }),
    check("categoryId", "Category ID is required").notEmpty(),
  ],
  sellerController.addProduct
);

/**
 * @route   PUT /api/seller/product/:id
 * @desc    Update a product's details
 * @access  Private (Seller only)
 */
router.put(
  "/product/:id",
  authCheck,
  sellerCheck,
  [
    check("name", "Product name is required").optional().notEmpty(),
    check("description", "Description is required").optional().notEmpty(),
    check("price", "Price must be a positive number")
      .optional()
      .isFloat({ min: 0 }),
  ],
  sellerController.updateProduct
);

/**
 * @route   DELETE /api/seller/product/:id
 * @desc    Remove a product from the seller's listings
 * @access  Private (Seller only)
 */
router.delete(
  "/product/:id",
  authCheck,
  sellerCheck,
  sellerController.deleteProduct
);

/**
 * @route   GET /api/seller/orders
 * @desc    View orders for the seller's products
 * @access  Private (Seller only)
 */
router.get("/orders", authCheck, sellerCheck, sellerController.getOrders);

/**
 * @route   PUT /api/seller/order/:orderId/status
 * @desc    Update the status of an order (e.g., shipped, delivered)
 * @access  Private (Seller only)
 */
router.put(
  "/order/:orderId/status",
  authCheck,
  sellerCheck,
  [check("status", "Status is required").notEmpty()],
  sellerController.updateOrderStatus
);

module.exports = router;
