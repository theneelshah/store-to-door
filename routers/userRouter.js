const express = require("express");
const {
  getUsers,
  getUser,
  createOrder,
  getOrders,
} = require("../controllers/userController");
const { signup, login, protect } = require("../controllers/authController");

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);

userRouter.route("/order").post(protect, createOrder).get(protect, getOrders);
userRouter.route("/").get(getUsers);
userRouter.route("/:uid").get(getUser);

module.exports = userRouter;
