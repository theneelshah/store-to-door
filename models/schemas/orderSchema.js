const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Vendor is required"],
  },
  vendor: {
    type: mongoose.Types.ObjectId,
    ref: "Vendor",
    required: [true, "Vendor is required"],
  },
  item: {
    type: mongoose.Types.ObjectId,
    required: [true, "Item is required"],
  },
  quantity: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    default: "Placed",
  },
});

module.exports = orderSchema;
