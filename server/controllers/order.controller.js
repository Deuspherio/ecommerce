const Order = require("../models/order.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const {
  decrementProductQuantity,
  incrementProductSold,
  roundToTwo,
  salesPercentagePerProduct,
  setPrediction,
} = require("../utilities");

const createOrder = asyncHandler(async (req, res) => {
  const order = await Order.create({
    orderedProducts: req.body.orderedProducts.map((x) => ({
      ...x,
      product: x._id,
    })),
    totalOrderedProducts: req.body.totalOrderedProducts,
    shippingInfo: { ...req.body.shippingInfo, id: req.user._id },
    productsPrice: req.body.productsPrice,
    shippingPrice: req.body.shippingPrice,
    totalPrice: roundToTwo(req.body.totalPrice),
    user: req.user._id,
  });

  await Promise.all(
    order.orderedProducts.map(async (x) => {
      await decrementProductQuantity(x._id, x.quantity);
      await incrementProductSold(x._id, x.quantity);
      await setPrediction(x._id);
    })
  );

  res.status(201).send({ message: "Order Successful", order });
});

const getOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.send(orders);
});

const getOrderId = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    return res.send(order);
  }
  res.status(404).send({ message: "Order Not Found" });
});

const orderSummary = asyncHandler(async (req, res) => {
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);

  const users = await User.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
      },
    },
  ]);

  const dailySales = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%m-%d", date: "$createdAt" } },
        orders: { $sum: 1 },
        sales: { $sum: "$totalPrice" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const monthlySales = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        sales: { $sum: "$totalPrice" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const totalSoldProducts = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalSoldItems: { $sum: "$totalSoldItems" },
      },
    },
  ]);

  const totalProductCategories = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ]);

  const availableElectronics = await Product.aggregate([
    {
      $match: { category: "electronics" },
    },
    {
      $group: {
        _id: "$name",
        stocks: { $sum: "$stocks" },
      },
    },
  ]);

  res.send({
    orders,
    users,
    dailySales,
    monthlySales,
    totalSoldProducts,
    availableElectronics,
    totalProductCategories,
  });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "fullName")
    .sort({ createdAt: -1 });

  res.send(orders);
});

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await Order.findOneAndDelete({ _id: order._id });
    const updatedOrders = await Order.find();
    return res.send(updatedOrders);
  }
  res.status(404).send({ message: "Order Not Found" });
});

const updatePaymentStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (req.body.payment) {
      await Order.updateOne(
        { _id: order._id },
        {
          $set: {
            isPaid: req.body.payment,
            paidAt: Date.now(),
          },
        }
      );
      return res.send({ message: "Order Payment is Updated" });
    }
    return res.send({ message: "Please wait for the payment" });
  }
  res.status(404).send({ message: "Order Not Found" });
});

const updateDelivery = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (req.body.delivery) {
      await Order.updateOne(
        { _id: order._id },
        {
          $set: {
            isDelivered: req.body.delivery,
            deliveredAt: Date.now(),
          },
        }
      );
      return res.send({ message: "Order Delivery is Updated" });
    }
    return res.send({ message: "Please wait for your order" });
  }
  res.status(404).send({ message: "Order Not Found" });
});

module.exports = {
  createOrder,
  getOrder,
  getOrderId,
  orderSummary,
  getAllOrders,
  updatePaymentStatus,
  updateDelivery,
  deleteOrder,
};
