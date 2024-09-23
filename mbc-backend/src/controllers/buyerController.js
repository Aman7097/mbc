const Product = require("../models/ProductModel"); // Assume you have a Product model
const { validationResult } = require("express-validator");


exports.searchProducts = async (req, res) => {
  try {
    const { query, sort, minPrice, maxPrice, rating } = req.query;
    let categoryId = null;

    const category = await Category.findOne({ name: { $regex: query, $options: 'i' } });
    if (category) {
      categoryId = category._id;
    }

    let searchCriteria = {};
    if (categoryId) {
      searchCriteria.categoryId = categoryId;
    } else {
      searchCriteria.$or = [
        { tags: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      searchCriteria.price = {};
      if (minPrice) searchCriteria.price.$gte = parseFloat(minPrice);
      if (maxPrice) searchCriteria.price.$lte = parseFloat(maxPrice);
    }

    if (rating) {
      searchCriteria.rating = { $gte: parseFloat(rating) };
    }

    let sortOptions = {};
    switch (sort) {
      case 'price_asc':
        sortOptions.price = 1;
        break;
      case 'price_desc':
        sortOptions.price = -1;
        break;
      case 'top_rated':
        sortOptions.rating = -1;
        break;
      default:
        sortOptions = { createdAt: -1 }; // Default sort by newest
    }

    const products = await Product.find(searchCriteria)
      .sort(sortOptions)
      .populate('categoryId', 'name');

    res.status(200).json({
      count: products.length,
      products: products
    });

  } catch (error) {
    console.error('Failed to search products:', error);
    res.status(500).json({ error: 'Failed to search products' });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categoryId",
      "name"
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

exports.placeOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Validation errors:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { productId, quantity } = req.body;

    // Find the product
    const product = await Product.findById(productId).populate("seller");
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Create order item
    const orderItem = {
      product: product._id,
      quantity: quantity,
      price: product.price,
    };

    const totalPrice = product.price * quantity;

    // Create new order
    const newOrder = new Order({
      buyer: req.user._id,
      orderItems: [orderItem],
      totalPrice: totalPrice,
    });

    // Save the order
    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Failed to place order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate({
        path: "orderItems.product",
        select: "name price",
        populate: { path: "categoryId", select: "name" },
      })
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      buyer: req.user._id,
    }).populate({
      path: "orderItems.product",
      select: "name price",
      populate: { path: "categoryId", select: "name" },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Failed to fetch order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};
