const express = require("express");
const {
  getAllProducts,
  getProductSlug,
  getProductId,
  updateProduct,
  productsAdmin,
  deleteProduct,
  createProduct,
  updateProductReviews,
  search,
  updateProductsPrice,
  updateProductsDiscount,
  getFilteredProducts,
  updateProductsIncrease,
} = require("../controllers/product.controller");
const router = express.Router();
const { isAuth, isAdmin } = require("../middleware");

router.route("/").get(getFilteredProducts).post(isAuth, isAdmin, createProduct);
router.route("/slug/:slug").get(getProductSlug);
router
  .route("/id/:id")
  .get(getProductId)
  .patch(isAuth, isAdmin, updateProduct)
  .delete(isAuth, isAdmin, deleteProduct);

router.get("/admin", isAuth, isAdmin, getAllProducts);
router.get("/search", search);
router.post("/reviews/id/:id", isAuth, updateProductReviews);

router.patch("/update/discounts", isAuth, isAdmin, updateProductsDiscount);
router.patch("/update/increase", isAuth, isAdmin, updateProductsIncrease);
router.patch("/update/prices", isAuth, isAdmin, updateProductsPrice);

module.exports = router;
