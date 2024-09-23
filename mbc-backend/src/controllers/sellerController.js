const Product = require("../models/ProductModel");
// const Order = require("../models/");
const { validationResult } = require("express-validator");

exports.addProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name,
      description,
      price,
      categoryId,
      reviews,
      overallRating,
      tags,
      images,
      productLink,
      platformName,
    } = req.body;

    // Create a new Product object
    const newProduct = new Product({
      name,
      description,
      price,
      categoryId,
      seller: req.user._id,
      reviews: reviews || [],
      overallRating,
      tags: tags || [], // Optional tags field, default to empty array if not provided
      images: images || [], // Optional images field, default to empty array if not provided
      productLink, // Only include if platformName exists
      platformName, // Optional field
    });
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
};

exports.updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        error: "Product not found or you're not authorized to update it",
      });
    }

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      seller: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        error: "Product not found or you're not authorized to delete it",
      });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ "product.seller": req.user._id })
      .populate("product", "name price")
      .populate("buyer", "name email");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, "product.seller": req.user._id },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        error: "Order not found or you're not authorized to update it",
      });
    }

    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
};

exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
