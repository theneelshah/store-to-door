const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;
  if ((!username, !email, !password, !confirmPassword)) {
    return res
      .status(400)
      .json({ status: "Failed", message: "Please enter all the fields" });
  }

  const newUser = await User.create({
    username,
    email,
    password,
    confirmPassword,
  });
  const token = signToken(newUser._id);

  res.status(200).json({
    status: "OK",
    message: "Created New User",
    token,
    user: { id: newUser._id, username: newUser.username, email: newUser.email },
  });
});
