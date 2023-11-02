const dotenv = require("dotenv");
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
dotenv.config();

const taskRoutes = require("./api/routes/tasks");

mongoose.connect(
  `mongodb+srv://adeb:${process.env.MONGODB_PSW}@cluster0.6fqo0fx.mongodb.net/?retryWrites=true&w=majority`
);

const secretKey = process.env.SECRET_KEY;
mongoose.Promise = global.Promise;

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

function authentificateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

function authorize(role) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];

      jwt.verify(token, secretKey, (err, user) => {
        console.log("User", user);
        if (err) {
          return res.sendStatus(403);
        }

        if (user.role === role) {
          req.user = user;
          next();
        } else {
          res.sendStatus(403);
        }
      });
    } else {
      res.sendStatus(401);
    }
  };
}

app.post("/login", (req, res) => {
  console.log(req);
  const name = req.body.username
  const password = req.body.password
  const token = jwt.sign({name}, secretKey, { expiresIn: "1h" });
  res.json(token);
});

app.get("/admin", authorize("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

app.get("/protected", authentificateJWT, (req, res) => {
  res.json({ message: "Protected data", user: req.user });
});

app.use("/tasks", taskRoutes);

app.use("/hello", (req, res, next) => {
  res.status(200);
  res.json({
    message: "Todo app",
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
