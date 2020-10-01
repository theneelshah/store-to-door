const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Vendor = require("../models/vendorModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

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
    user: {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const savedUser = await User.findOne({ email });
  console.log(savedUser);

  if (!savedUser)
    return res
      .status(401)
      .json({ status: "Failed", message: "Invalid user or password" });

  const present = await bcrypt.compare(password, savedUser.password);

  if (!present)
    return res
      .status(401)
      .json({ status: "Failed", message: "Invalid user or password" });

  const token = await signToken(savedUser._id);

  return res
    .status(200)
    .json({ status: "OK", message: "Logged in!", token, user: savedUser });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting the token
  const { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith("bearer")) {
    token = authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please login to continue.", 401)
    );
  }

  // 2) Verifying the token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Checking if the user still exists

  const freshUser = await User.findById(decode.id);
  if (!freshUser) {
    return next(
      new AppError("The user belonging to the token doesn't exist", 401)
    );
  }

  // 4) Check if user changed the password after the token was issued

  if (freshUser.changedPasswordAfter(decode.iat)) {
    return next(
      new AppError(
        "User has recently changed password! Please login again to continue",
        401
      )
    );
  }

  next();
});

exports.signupVendor = catchAsync(async (req, res, next) => {
  const { username, password, email, confirmPassword, vendorType } = req.body;
  if ((!username, !email, !password, !confirmPassword, !vendorType)) {
    return res
      .status(400)
      .json({ status: "Failed", message: "Please enter all the fields" });
  }

  const newVendor = await Vendor.create({
    username,
    email,
    password,
    confirmPassword,
    vendorType,
  });

  const token = signToken(newVendor._id);

  res.status(200).json({
    status: "OK",
    message: "Created new Vendor",
    token,
    vendor: {
      _id: newVendor._id,
      username: newVendor.username,
      email: newVendor.email,
      vendorType: newVendor.vendorType,
    },
  });
});

exports.loginVendor = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const savedUser = await Vendor.findOne({ email });
  console.log(savedUser);

  if (!savedUser)
    return res
      .status(401)
      .json({ status: "Failed", message: "Invalid user or password" });

  const present = await bcrypt.compare(password, savedUser.password);

  if (!present)
    return res
      .status(401)
      .json({ status: "Failed", message: "Invalid user or password" });

  const token = await signToken(savedUser._id);

  return res
    .status(200)
    .json({ status: "OK", message: "Logged in!", token, user: savedUser });
});

exports.protectVendor = catchAsync(async (req, res, next) => {
  // 1) Getting the token
  const { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith("bearer")) {
    token = authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please login to continue.", 401)
    );
  }

  // 2) Verifying the token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Checking if the user still exists

  const freshVendor = await Vendor.findById(decode.id);
  if (!freshVendor) {
    return next(
      new AppError("The user belonging to the token doesn't exist", 401)
    );
  }

  // 4) Check if user changed the password after the token was issued

  if (freshVendor.changedPasswordAfter(decode.iat)) {
    return next(
      new AppError(
        "User has recently changed password! Please login again to continue",
        401
      )
    );
  }

  next();
});
