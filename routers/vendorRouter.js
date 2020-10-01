const express = require("express");
const {
  signupVendor,
  protectVendor,
  loginVendor,
} = require("../controllers/authController");

const { addItems } = require("../controllers/vendorController");

const vendorRouter = express.Router();

vendorRouter.post("/signup", signupVendor);
vendorRouter.post("/login", loginVendor);

vendorRouter.route("/").put(protectVendor, addItems);

module.exports = vendorRouter;
