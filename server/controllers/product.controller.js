const Product = require("../models/product.model");
const asyncHandler = require("express-async-handler");
const {
  applyPrediction,
  setPastData,
  setPrediction,
  applyDiscountPerProduct,
  applyIncreasePerProduct,
} = require("../utilities");

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

const PAGE_SIZE = 6;
const getFilteredProducts = asyncHandler(async (req, res) => {
  const { query } = req;
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || "";
  const price = query.price || "";
  const rating = query.rating || "";
  const order = query.order || "";

  const categoryFilter = category && category !== "all" ? { category } : {};
  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            $gte: +rating,
          },
        }
      : {};
  const priceFilter =
    price && price !== "all"
      ? {
          currentPrice: {
            $gte: +price.split("-")[0],
            $lte: +price.split("-")[1],
          },
        }
      : {};
  const sortOrder =
    order === "featured"
      ? { featured: 1 }
      : order === "lowest"
      ? { price: 1 }
      : order === "toprated"
      ? { price: -1 }
      : order === "newest"
      ? { createdAt: -1 }
      : { _id: -1 };

  const products = await Product.find({
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
    .sort(sortOrder)
    .skip(pageSize * (page - 1))
    .limit(pageSize);
  const countProducts = await Product.countDocuments({
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  });
  const productCategories = await Product.find().distinct("category");
  const allProducts = await Product.find();

  res.send({
    products,
    countProducts,
    page,
    pages: Math.ceil(countProducts / pageSize),
    productCategories,
    allProducts,
  });
});

const getProductSlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) {
    return res.status(404).send({ message: "Product Not Found" });
  }
  res.send(product);
});

const getProductId = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.send(product);
  }

  res.status(404).send({ message: "Product Not Found" });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.updateOne(
      { _id: product._id },
      {
        $inc: { stocks: +req.body.stocks },
      }
    );
    const newProduct = await Product.findById(product._id);
    return res.send(newProduct);
  }
  res.status(404).send({ message: "Product Not Found" });
});

const productsAdmin = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({
    createdAt: -1,
  });

  res.send(products);
});

const updateProductReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    if (product.reviews.find((x) => x.email === req.user.email)) {
      return res.status(400).send({ message: "Submitted Already a Review" });
    }
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
    return res.status(201).send(newProduct);
  }
  res.status(404).send({ message: "Product Was Not Found" });
});

const search = asyncHandler(async (req, res) => {
  const { query } = req;
  const searchQuery = query.query || "";
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || "";
  const price = query.price || "";
  const rating = query.rating || "";
  const order = query.order || "";

  const queryFilter =
    searchQuery && searchQuery !== "all"
      ? {
          name: {
            $regex: searchQuery,
            $options: "i",
          },
        }
      : {};

  const categoryFilter = category && category !== "all" ? { category } : {};
  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            $gte: +rating,
          },
        }
      : {};
  const priceFilter =
    price && price !== "all"
      ? {
          currentPrice: {
            $gte: +price.split("-")[0],
            $lte: +price.split("-")[1],
          },
        }
      : {};
  const sortOrder =
    order === "featured"
      ? { featured: 1 }
      : order === "lowest"
      ? { price: 1 }
      : order === "toprated"
      ? { price: -1 }
      : order === "newest"
      ? { createdAt: -1 }
      : { _id: -1 };

  const products = await Product.find({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
    .sort(sortOrder)
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  });

  const productCategories = await Product.find().distinct("category");

  res.send({
    products,
    countProducts,
    page,
    pages: Math.ceil(countProducts / pageSize),
    productCategories,
  });
});

const refreshPrediction = asyncHandler(async (req, res) => {
  const products = await Product.find();

  await Promise.all(
    products.map(async (x) => {
      await setPrediction(x._id);
    })
  );

  const updatedProducts = await Product.find();

  res.send(updatedProducts);
});

const updateProductsDiscount = asyncHandler(async (req, res) => {
  const products = await Product.find();
  const newDiscount = parseFloat(req.body.discount / 100);

  await Promise.all(
    products.map(async (x) => {
      await applyDiscountPerProduct(x._id, newDiscount);
      await setPrediction(x._id);
    })
  );
  const updatedProducts = await Product.find();

  res.send(updatedProducts);
});

const updateProductsIncrease = asyncHandler(async (req, res) => {
  const products = await Product.find();
  const newIncrease = parseFloat(req.body.increase / 100);

  await Promise.all(
    products.map(async (x) => {
      await applyIncreasePerProduct(x._id, newIncrease);
      await setPrediction(x._id);
    })
  );
  const updatedProducts = await Product.find();

  res.send(updatedProducts);
});

const updateProductsPrice = asyncHandler(async (req, res) => {
  const products = await Product.find();
  const setAlgo = req.body.algo;

  await Promise.all(
    products.map(async (x) => {
      await applyPrediction(x._id, setAlgo);
      await setPastData(x._id);
      await setPrediction(x._id);
    })
  );
  const updatedProducts = await Product.find();
  res.send(updatedProducts);
});

module.exports = {
  getAllProducts,
  getFilteredProducts,
  getProductSlug,
  getProductId,
  updateProduct,
  productsAdmin,
  updateProductReviews,
  search,
  updateProductsDiscount,
  updateProductsIncrease,
  updateProductsPrice,
  refreshPrediction,
};
