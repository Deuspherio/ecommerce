const Product = require("../model/productModel");
const asyncHandler = require("express-async-handler");
const { spawn } = require("child_process");
const path = require("path");
const absolutePath = path.resolve();
require("dotenv").config();

// 2. Connect nodejs to python
const sendData = async (sales, stocks) => {
  try {
    const run = async (sales, stocks) =>
      new Promise((resolve, reject) => {
        let result = "";
        // 3. Send the necessary data to the algo
        const pythonProcess =
          process.env.NODE_ENV === "production"
            ? spawn("python", [
                path.join(absolutePath, "/backend/utilities/algo.py"),
                sales,
                stocks,
              ])
            : spawn("python", [
                path.join(absolutePath, "/utilities/algo.py"),
                sales,
                stocks,
              ]);
        // 11. Receive the results from the algo
        pythonProcess.stdout.on("data", (data) => {
          result += data.toString().replace(/(\r\n|\n\r)/gm, "");
        });
        pythonProcess.on("close", (code) => {
          resolve(parseFloat(result));
        });
        pythonProcess.stderr.on("data", (err) => {
          reject(err.toString());
        });
      });
    const receivedData = asyncHandler(async (sales, stocks) => {
      const value = await run(sales, stocks);
      return value;
    });
    return receivedData(sales, stocks);
  } catch (err) {
    console.log(err.toString());
  }
};

const salesPercentagePerProduct = async (id) => {
  const product = await Product.findById(id);
  if (product) {
    const zeroStocks = product.pastStocks === 0 ? 1 : product.pastStocks;
    await Product.updateOne(
      { _id: product._id },
      {
        $set: {
          salesPercentage:
            (product.soldItems * product.discountedPrice) /
            (zeroStocks * product.discountedPrice),
        },
      }
    );
  }
};

const applyDiscountPerProduct = async (id, discount) => {
  const product = await Product.findById(id);
  if (product) {
    await Product.updateOne(
      { _id: product._id },
      {
        $set: {
          discount: discount,
        },
      }
    );
  }
};

const setPrediction = async (id) => {
  const product = await Product.findById(id);
  // 1. Get the data from the database
  const { salesPercentage, pastStocks, discount } = product;
  // 12. Use the results from the algorithm to apply the discount
  const result = await sendData(salesPercentage, pastStocks);
  const predictionWithDiscount = result === 0 ? 0 : -discount;
  if (product) {
    // 13. Update the price prediction per product
    const totalPriceDiscount =
      product.price * predictionWithDiscount + product.price;

    await Product.updateOne(
      { _id: product._id },
      {
        $set: {
          pricePrediction: totalPriceDiscount,
        },
      }
    );
  }
};

const applyPrediction = async (id) => {
  const product = await Product.findById(id);
  // 14. Set the final price using the price prediction once the admin has decided
  if (product) {
    await Product.updateOne(
      { _id: product._id },
      {
        $set: {
          discountedPrice: product.pricePrediction,
        },
      }
    );
  }
};

const setPastData = async (id) => {
  const product = await Product.findById(id);
  if (product) {
    await Product.updateOne(
      { _id: product._id },
      {
        $set: {
          pastStocks: product.stocks,
          soldItems: 0,
        },
      }
    );
  }
};

const roundToTwo = (num) => {
  return +(Math.round(num + "e+2") + "e-2");
};

const decrementProductQuantity = async (id, orderQuantity) => {
  const product = await Product.findById(id);
  if (product) {
    await Product.updateOne(
      { _id: product._id },
      {
        $inc: {
          stocks: -orderQuantity,
        },
      }
    );
  }
};

const incrementProductSold = async (id, productSold) => {
  const product = await Product.findById(id);
  if (product) {
    await Product.updateOne(
      { _id: product._id },
      {
        $inc: {
          totalSoldItems: productSold,
          soldItems: productSold,
        },
      }
    );
  }
};

module.exports = {
  setPrediction,
  salesPercentagePerProduct,
  applyPrediction,
  setPastData,
  applyDiscountPerProduct,
  decrementProductQuantity,
  incrementProductSold,
  roundToTwo,
};
