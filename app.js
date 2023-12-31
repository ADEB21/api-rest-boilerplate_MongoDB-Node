const dotenv = require("dotenv");
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
dotenv.config();

const productRoutes = require("./api/routes/products");
const taskRoutes = require("./api/routes/tasks")

mongoose.connect(
  `mongodb+srv://adeb:${process.env.MONGODB_PSW}@cluster0.6fqo0fx.mongodb.net/?retryWrites=true&w=majority`
);

mongoose.Promise = global.Promise

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRoutes);
app.use("/tasks", taskRoutes);

app.use("/", (req, res, next) => {
  res.status(200);
  res.json({
    message: "Hello world",
  });
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
