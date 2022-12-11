const Order = require("../model/orderModel");
const Product = require("../model/productModel");
const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const {
  decrementProductQuantity,
  incrementProductSold,
  roundToTwo,
  salesPercentagePerProduct,
  setPrediction,
} = require("../utilities");

const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.create({
    orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
    totalOrderItems: req.body.totalOrderItems,
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod,
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

const getSingleOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.send(orders);
});

const getOrderId = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    res.send(order);
  } else {
    res.status(404).send({ message: "Order Not Found" });
  }
});

const orderSummary = asyncHandler(async (req, res) => {
  const products = await Product.find();

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

  const dailyOrders = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%m-%d", date: "$createdAt" } },
        orders: { $sum: 1 },
        sales: { $sum: "$totalPrice" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const faceCreamAvailable = await Product.aggregate([
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

  const lipstickAvailable = await Product.aggregate([
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

  const lotionAvailable = await Product.aggregate([
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

  const powderAvailable = await Product.aggregate([
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
    dailyOrders,
    faceCreamAvailable,
    lipstickAvailable,
    lotionAvailable,
    powderAvailable,
    products,
  });
});

const allOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "fullName")
    .sort({ createdAt: -1 });

  res.send(orders);
});

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await Order.findOneAndDelete({ _id: order._id });
    res.send({ message: "Order Deleted" });
  } else {
    res.status(404).send({ message: "Order Not Found" });
  }
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
    res.send({ message: "Payment Status Updated" });
  } else {
    res.status(404).send({ message: "Order Not Found" });
  }
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
    res.send({ message: "Order Deleivery is Updated" });
  } else {
    res.status(404).send({ message: "Order Not Found" });
  }
});

module.exports = {
  getOrder,
  getSingleOrder,
  getOrderId,
  orderSummary,
  allOrders,
  updatePaymentStatus,
  updateDelivery,
  deleteOrder,
};
