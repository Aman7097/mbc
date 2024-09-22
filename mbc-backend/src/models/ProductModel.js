const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    reviews: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    overallRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    tags: [{ type: String }],
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: [{ type: String }],
    productLink: {
      type: String,
      trim: true,
      required: function () {
        return !!this.platformName; // Required only if platformName exists
      },
    },

    platformName: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
productSchema.index({ seller: 1, price: 1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
