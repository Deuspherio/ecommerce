const Product = require("../models/product.model");
const asyncHandler = require("express-async-handler");
const { spawn } = require("child_process");
const path = require("path");
const absolutePath = path.resolve();
require("dotenv").config();

const sendData = async (name, soldProducts, sales, date, month) => {
  try {
    const run = async (name, soldProducts, sales, date, month) =>
      new Promise((resolve, reject) => {
        let result = "";
        const pythonProcess =
          process.env.NODE_ENV === "production"
            ? spawn("python", [
                path.join(absolutePath, "/server/utilities/algo.py"),
                name,
                soldProducts,
                sales,
                date,
                month,
              ])
            : spawn("python", [
                path.join(absolutePath, "/utilities/algo.py"),
                name,
                soldProducts,
                sales,
                date,
                month,
              ]);
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
    const receivedData = asyncHandler(
      async (name, soldProducts, sales, date, month) => {
        const value = await run(name, soldProducts, sales, date, month);
        return value;
      }
    );
    return receivedData(name, soldProducts, sales, date, month);
  } catch (err) {
    console.log(err.toString());
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

const applyIncreasePerProduct = async (id, increase) => {
  const product = await Product.findById(id);
  if (product) {
    await Product.updateOne(
      { _id: product._id },
      {
        $set: {
          increase: increase,
        },
      }
    );
  }
};

const productName = (name) => {
  switch (name) {
    case "20in Monitor":
      return 0;
    case "27in 4K Gaming Monitor":
      return 1;
    case "27in FHD Monitor":
      return 2;
    case "34in Ultrawide Monitor":
      return 3;
    case "Energizer AA Batteries (4-pack)":
      return 4;
    case "Energizer AAA Batteries (4-pack)":
      return 5;
    case "Apple Airpods Headphones":
      return 6;
    case "Bose SoundSport Headphones":
      return 7;
    case "Flatscreen TV":
      return 8;
    case "Google Phone":
      return 9;
    case "IPhone":
      return 10;
    case "LG Dryer":
      return 11;
    case "LG Washing Machine":
      return 12;
    case "Lightning Charging Cable":
      return 13;
    case "MacBook Pro Laptop":
      return 14;
    case "ThinkPad Laptop":
      return 15;
    case "USB-C Charging Cable":
      return 16;
    case "Wired Headphones":
      return 17;

    default:
      return 0;
  }
};

const setPrediction = async (id) => {
  const product = await Product.findById(id);
  const { discount, increase } = product;
  const { name, soldProducts, sales } = product;
  const productCode = productName(name);
  const date = new Date();
  const result = await sendData(
    productCode,
    soldProducts,
    sales,
    date.getDate(),
    date.getMonth() + 1
  );

  const predictionWithDiscountOrIncrease = result === 0 ? increase : -discount;
  const priceSuggestion = result === 0 ? "increase" : "decrease";
  if (product) {
    const totalDiscountOrIncrease = roundToTwo(
      product.price * predictionWithDiscountOrIncrease + product.price
    );

    await Product.updateOne(
      { _id: product._id },
      {
        $set: {
          priceSuggestion: priceSuggestion,
          pricePrediction: roundToTwo(totalDiscountOrIncrease),
        },
      }
    );
  }
};

const applyPrediction = async (id) => {
  const product = await Product.findById(id);
  if (product) {
    await Product.updateOne(
      { _id: product._id },
      {
        $set: {
          currentPrice: product.pricePrediction,
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
          sales: 0,
          soldProducts: 0,
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
          sales: roundToTwo(product.price * productSold),
          soldProducts: productSold,
          totalSoldProducts: productSold,
        },
      }
    );
  }
};

module.exports = {
  setPrediction,
  applyPrediction,
  setPastData,
  applyDiscountPerProduct,
  applyIncreasePerProduct,
  decrementProductQuantity,
  incrementProductSold,
  roundToTwo,
};
