const mongoose = require("mongoose");
const itemSchema = mongoose.Schema({
  name: { type: String, required: [true, "name is required"] },
  price: { type: Number, required: [true, "price is required"] },
  images: { type: [String] },
});

module.exports = itemSchema;
