const express = require("express");
const {
  createOrder,
  getOrderId,
  getOrder,
  orderSummary,
  deleteOrder,
  getAllOrders,
  updatePaymentStatus,
  updateDelivery,
} = require("../controllers/order.controller");
const { isAuth, isAdmin } = require("../middleware");
const router = express.Router();

router.route("/").get(isAuth, isAdmin, getAllOrders).post(isAuth, createOrder);
router
  .route("/id/:id")
  .get(isAuth, getOrderId)
  .delete(isAuth, isAdmin, deleteOrder);

router.get("/history", isAuth, getOrder);
router.get("/summary", isAuth, isAdmin, orderSummary);
router.patch("/payment/id/:id", isAuth, isAdmin, updatePaymentStatus);
router.patch("/delivery/id/:id", isAuth, updateDelivery);

module.exports = router;
