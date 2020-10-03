const express = require("express");
const {
  signupVendor,
  protectVendor,
  loginVendor,
} = require("../controllers/authController");

const {
  addItems,
  getVendors,
  getVendor,
  updateItems,
  deleteItem,
  getItems,
} = require("../controllers/vendorController");

const vendorRouter = express.Router();

vendorRouter.post("/signup", signupVendor);
vendorRouter.post("/login", loginVendor);

vendorRouter.route("/").get(getVendors);
vendorRouter.route("/:vid").put(protectVendor, addItems).get(getVendor);
vendorRouter.route("/:vid/item").get(getItems);
vendorRouter
  .route("/:vid/item/:item")
  .put(protectVendor, updateItems)
  .delete(protectVendor, deleteItem);

module.exports = vendorRouter;
