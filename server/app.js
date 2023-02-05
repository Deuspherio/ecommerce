const express = require("express");
const connectDB = require("./db/connect");
const app = express();
const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");
const orderRoutes = require("./routes/order.routes");
const cors = require("cors");
const path = require("path");
const compression = require("compression");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
  next();
});
app.use(cors());
app.use(compression());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

if (process.env.NODE_ENV === "production") {
  const absolutePath = path.resolve();
  app.use(express.static(path.join(absolutePath, "/client/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.join(absolutePath, "/client/build/index.html"))
  );
}

const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    console.log("Connected to the db...");
    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
