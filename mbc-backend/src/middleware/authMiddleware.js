const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const authCheck = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "testsecret");

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware for buyer role
const buyerCheck = (req, res, next) => {
  if (req.user.role !== "buyer") {
    return res.status(403).json({ message: "Access restricted to buyers" });
  }
  next();
};

// Middleware for seller role
const sellerCheck = (req, res, next) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({ message: "Access restricted to sellers" });
  }
  next();
};

// Middleware for admin role
const adminCheck = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access restricted to admins" });
  }
  next();
};

module.exports = { authCheck, buyerCheck, sellerCheck, adminCheck };
