const express = require("express");
const {
  getAllProducts,
  getSingleSlug,
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
  updateProductsDiscountByCategory,
  updateProductsPriceByCategory,
  updateProductDiscountById,
  updateProductPriceById,
} = require("../controllers/product.controller");
const router = express.Router();
const { isAuth, isAdmin } = require("../middleware");

router.route("/").get(getFilteredProducts).post(isAuth, isAdmin, createProduct);
router
  .route("/id/:id")
  .get(getProductId)
  .patch(isAuth, isAdmin, updateProduct)
  .delete(isAuth, isAdmin, deleteProduct);

router.get("/admin", isAuth, isAdmin, getAllProducts);
router.get("/search", search);
router.post("/reviews/id/:id", isAuth, updateProductReviews);

router.patch("/update/discounts", isAuth, isAdmin, updateProductsDiscount);
router.patch("/update/prices", isAuth, isAdmin, updateProductsPrice);
router.patch(
  "/update/discounts/category",
  isAuth,
  isAdmin,
  updateProductsDiscountByCategory
);
router.patch(
  "/update/price/category",
  isAuth,
  isAdmin,
  updateProductsPriceByCategory
);
router.patch(
  "/update/discounts/id/:id",
  isAuth,
  isAdmin,
  updateProductDiscountById
);
router.patch("/update/price/id/:id", isAuth, isAdmin, updateProductPriceById);

module.exports = router;
