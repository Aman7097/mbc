const Category = require("../models/CategoryModel"); // Assume you have a Category model
const User = require("../models/UserModel"); // Assume you have a User model

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }
    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to create category" });
  }
};

exports.addSeller = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }
    const newSeller = await User.create({
      name,
      email,
      password,
      role: "seller",
    });

    res
      .status(201)
      .json({ message: "Seller added successfully", sellerId: newSeller._id });
  } catch (error) {
    res.status(500).json({ error: "Failed to add seller" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
