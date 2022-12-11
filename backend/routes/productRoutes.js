const express = require("express");
const {
  allProducts,
  getSingleSlug,
  getSingleId,
  productEdit,
  productsAdmin,
  deleteSingleProduct,
  createProduct,
  productReviews,
  search,
  activateAlgo,
  previewAlgo,
} = require("../controller/productController");
const router = express.Router();
const { isAuth, isAdmin } = require("../middleware");

router.get("/", allProducts);
router.get("/slug/:slug", getSingleSlug);
router.get("/id/:id", getSingleId);
router.get("/search", search);
router.post("/reviews/id/:id", isAuth, productReviews);
router.patch("/id/:id", isAuth, isAdmin, productEdit);
router.get("/admin", isAuth, isAdmin, productsAdmin);
router.post("/create-product", isAuth, isAdmin, createProduct);
router.delete("/delete/:id", isAuth, isAdmin, deleteSingleProduct);
router.patch("/preview-algo", isAuth, isAdmin, previewAlgo);
router.patch("/activate-algo", isAuth, isAdmin, activateAlgo);

module.exports = router;
