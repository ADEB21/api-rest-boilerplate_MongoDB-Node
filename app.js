const dotenv = require("dotenv");
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
dotenv.config();

const taskRoutes = require("./api/routes/tasks");
const userRoutes = require("./api/routes/user");
const checkAuth = require("./api/middleware/check-auth");

mongoose.connect(process.env.MONGODB_DB_PROD);

const secretKey = process.env.SECRET_KEY;
mongoose.Promise = global.Promise;

// function authorize(role) {
//   return (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (authHeader) {
//       const token = authHeader.split(" ")[1];

//       jwt.verify(token, secretKey, (err, user) => {
//         if (err) {
//           return res.sendStatus(403);
//         }

//         if (user.role === role) {
//           req.user = user;
//           next();
//         } else {
//           res.sendStatus(403);
//         }
//       });
//     } else {
//       res.sendStatus(401);
//     }
//   };
// }

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

app.use("/tasks", taskRoutes);
app.use("/user", userRoutes);


app.get("/dashboard", checkAuth, (req, res) => {
  res.json({ message: "Protected data", user: req.user });
});

// app.get("/admin", authorize("admin"), (req, res) => {
//   res.json({ message: "Welcome Admin" });
// });

module.exports = app;
