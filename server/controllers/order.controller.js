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
    orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
    totalOrderItems: req.body.totalOrderItems,
    shippingData: req.body.shippingData,
    itemsPrice: req.body.itemsPrice,
    shippingPrice: req.body.shippingPrice,
    totalPrice: roundToTwo(req.body.totalPrice),
    user: req.user._id,
  });

  await Promise.all(
    order.orderItems.map(async (x) => {
      await decrementProductQuantity(x._id, x.quantity);
      await incrementProductSold(x._id, x.quantity);
      await salesPercentagePerProduct(x._id);
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

  const availableFaceCream = await Product.aggregate([
    {
      $match: { category: "face-cream" },
    },
    {
      $group: {
        _id: "$name",
        stocks: { $sum: "$stocks" },
      },
    },
  ]);

  const availableLipstick = await Product.aggregate([
    {
      $match: { category: "lipstick" },
    },
    {
      $group: {
        _id: "$name",
        stocks: { $sum: "$stocks" },
      },
    },
  ]);

  const availableLotion = await Product.aggregate([
    {
      $match: { category: "lotion" },
    },
    {
      $group: {
        _id: "$name",
        stocks: { $sum: "$stocks" },
      },
    },
  ]);

  const availablePowder = await Product.aggregate([
    {
      $match: { category: "powder" },
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
    availableFaceCream,
    availableLipstick,
    availableLotion,
    availablePowder,
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
    await Order.updateOne(
      { _id: order._id },
      {
        $set: {
          isPaid: true,
          paidAt: Date.now(),
        },
      }
    );
    return res.send({ message: "Payment Status Updated" });
  }
  res.status(404).send({ message: "Order Not Found" });
});

const updateDelivery = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await Order.updateOne(
      { _id: order._id },
      {
        $set: {
          isDelivered: req.body.isDelivered,
          deliveredAt: Date.now(),
        },
      }
    );
    return res.send({ message: "Order Deleivery is Updated" });
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
