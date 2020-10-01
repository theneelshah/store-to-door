const express = require("express");
const { getUsers, getUser } = require("../controllers/userController");
const { signup, login } = require("../controllers/authController");

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.route("/").get(getUsers);

userRouter.route("/:uid").get(getUser);

module.exports = userRouter;
