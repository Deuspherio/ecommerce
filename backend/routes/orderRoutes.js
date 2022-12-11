const express = require("express");
const {
  getOrder,
  getOrderId,
  getSingleOrder,
  orderSummary,
  deleteOrder,
  allOrders,
  updatePaymentStatus,
  updateDelivery,
} = require("../controller/orderController");
const { isAuth, isAdmin } = require("../middleware");
const router = express.Router();

router.post("/", isAuth, getOrder);
router.get("/single-order", isAuth, getSingleOrder);
router.get("/id/:id", isAuth, getOrderId);
router.get("/summary", isAuth, isAdmin, orderSummary);
router.get("/all-orders", isAuth, isAdmin, allOrders);
router.patch("/payment-update/:id", isAuth, isAdmin, updatePaymentStatus);
router.patch("/delivery-update/:id", isAuth, updateDelivery);
router.delete("/delete/:id", isAuth, isAdmin, deleteOrder);

module.exports = router;
