const express = require("express");
const {
  loginDeliveryPerson,
  protectDeliveryPerson,
  signupDeliveryPerson,
} = require("../controllers/authController");
const { getNearOrders } = require("../controllers/deliveryController");

const deliveryRouter = express.Router();

deliveryRouter.post("/signup", signupDeliveryPerson);
deliveryRouter.post("/login", loginDeliveryPerson);

deliveryRouter.route("/").get(protectDeliveryPerson, getNearOrders);

module.exports = deliveryRouter;
