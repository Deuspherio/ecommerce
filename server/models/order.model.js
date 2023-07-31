const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const orderSchema = new mongoose.Schema(
  {
    orderedProducts: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        image: { type: String },
        quantity: { type: Number, required: true },
        category: { type: String },
        currentPrice: { type: Number, required: true },
      },
    ],
    shippingInfo: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: Number,
        required: true,
      },
      address: { type: String, required: true },
      paymentMethod: { type: String, required: true },
    },
    totalOrderedProducts: { type: Number, required: true },
    productsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
