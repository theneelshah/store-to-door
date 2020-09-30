const express = require("express");
const { getUsers } = require("../controllers/userController");
const { signup } = require("../controllers/authController");

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.route("/").get(getUsers);

module.exports = userRouter;
