const mongoose = require("mongoose");
const geoSchema = mongoose.Schema({
  type: {
    type: String,
    default: "Point",
  },
  coordinates: {
    type: [Number],
  },
});

module.exports = geoSchema;
