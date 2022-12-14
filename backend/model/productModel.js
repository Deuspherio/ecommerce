const mongoose = require("mongoose");

const productReviewsSchema = new mongoose.Schema(
  {
    firstName: {
      type: "String",
      required: true,
    },
    lastName: {
      type: "String",
      required: true,
    },
    email: {
      type: "String",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comments: {
      type: "String",
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: String },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    pricePrediction: { type: Number },
    discountedPrice: { type: Number },
    discount: { type: Number },
    stocks: { type: Number, required: true },
    rating: { type: Number },
    numReviews: { type: Number },
    description: { type: String },
    lowStocks: { type: Number },
    soldItems: { type: Number },
    totalSoldItems: { type: Number },
    pastStocks: { type: Number },
    salesPercentage: { type: Number },
    reviews: [productReviewsSchema],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
