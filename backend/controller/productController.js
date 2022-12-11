const Product = require("../model/productModel");
const asyncHandler = require("express-async-handler");
const {
  applyPrediction,
  setPastData,
  setPrediction,
  salesPercentagePerProduct,
  applyDiscountPerProduct,
} = require("../utilities");

const allProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

const getSingleSlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) res.status(404).send({ message: "Product Not Found" });
  else res.send(product);
});

const getSingleId = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) res.send(product);
  else res.status(404).send({ message: "Product Not Found" });
});

const productEdit = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.updateOne(
      { _id: product.id },
      {
        name: req.body.name,
        slug: req.body.slug,
        category: req.body.category,
        price: req.body.price,
        discountedPrice: req.body.price,
        pricePrediction: req.body.price,
        stocks: req.body.stocks,
        pastStocks: req.body.stocks,
        salesPercentage: 0,
        soldItems: 0,
        description: req.body.description,
      }
    );
    res.send({ message: "Product Updated" });
  } else res.status(404).send({ message: "Product Not Found" });
});

const productsAdmin = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({
    createdAt: -1,
  });

  res.send(products);
});

const createProduct = asyncHandler(async (req, res) => {
  await Product.create({
    name: req.body.name,
    slug: req.body.slug,
    category: req.body.category,
    price: req.body.price,
    discountedPrice: req.body.price,
    discount: 0,
    pricePrediction: req.body.price,
    stocks: req.body.stocks,
    pastStocks: req.body.stocks,
    description: req.body.description,
    soldItems: 0,
    totalSoldItems: 0,
    rating: 0,
    numReviews: 0,
    salesPercentage: 0,
    reviews: [],
  });
  res.send({ message: "Product Created Successfully" });
});

const deleteSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.findOneAndDelete({ _id: product._id });
    res.send({ message: "Product Deleted" });
  } else res.status(404).send({ message: "Product was Not Found" });
});

const productReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    if (product.reviews.find((x) => x.email === req.user.email))
      res.status(400).send({ message: "Submitted Already a Review" });
    else {
      const productReview = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        rating: req.body.rating,
        comments: req.body.comments,
      };
      await Product.updateOne(
        { _id: product._id },
        {
          $push: {
            reviews: productReview,
          },
        }
      );
      const updatedProduct = await Product.findById(product._id);
      const updatedNumReviews = updatedProduct.reviews.length;
      const updatedRating =
        updatedProduct.reviews.reduce((a, c) => c.rating + a, 0) /
        updatedProduct.reviews.length;
      await Product.updateOne(
        { _id: product._id },
        {
          $set: {
            rating: updatedRating,
            numReviews: updatedNumReviews,
          },
        }
      );
      const newProduct = await Product.findById(updatedProduct._id);
      res.status(201).send({
        message: "Reviewed Successfully",
        numReviews: newProduct.numReviews,
        rating: newProduct.rating,
        firstName: newProduct.reviews.firstName,
        lastName: newProduct.reviews.lastName,
      });
    }
  } else res.status(404).send({ message: "Product Was Not Found" });
});

const search = asyncHandler(async (req, res) => {
  const searchName = req.query.name || "";
  const nameFilter =
    searchName && searchName !== "all"
      ? {
          name: {
            $regex: searchName,
            $options: "i",
          },
        }
      : {};
  const products = await Product.find({ ...nameFilter });
  res.send(products);
});

const previewAlgo = asyncHandler(async (req, res) => {
  const product = await Product.find();
  const fixedDiscount = parseFloat(req.body.previewPredict) / 100;

  await Promise.all(
    product.map(async (x) => {
      await applyDiscountPerProduct(x._id, fixedDiscount);
      await setPrediction(x._id);
    })
  );
  res.send({ message: "Price Preview Updated" });
});

const activateAlgo = asyncHandler(async (req, res) => {
  const product = await Product.find();

  await Promise.all(
    product.map(async (x) => {
      await applyPrediction(x._id);
      await setPastData(x._id);
      await salesPercentagePerProduct(x._id);
      await setPrediction(x._id);
    })
  );
  res.send({ message: "Price Updated" });
});

module.exports = {
  allProducts,
  getSingleSlug,
  getSingleId,
  productEdit,
  productsAdmin,
  deleteSingleProduct,
  createProduct,
  productReviews,
  search,
  previewAlgo,
  activateAlgo,
};
