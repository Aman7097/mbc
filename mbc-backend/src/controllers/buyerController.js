const Product = require("../models/ProductModel"); // Assume you have a Product model
// const Order = require("../models/Order"); // Assume you have an Order model
const { validationResult } = require("express-validator");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate("category", "name");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name"
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

exports.placeOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // const newOrder = new Order({
    //   buyer: req.user._id,
    //   product: productId,
    //   quantity,
    //   totalPrice: product.price * quantity,
    // });

    // await newOrder.save();
    // res
    //   .status(201)
    //   .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: "Failed to place order" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    // const orders = await Order.find({ buyer: req.user._id }).populate(
    //   "product",
    //   "name price"
    // );
    // res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
