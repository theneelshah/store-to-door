const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const itemSchema = require("./schemas/itemSchema");
const geoSchema = require("./schemas/geoSchema");
const orderSchema = require("./schemas/orderSchema");

const vendorSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are different",
    },
  },
  vendorType: {
    type: String,
    required: [true, "A vendor must have a type"],
    enum: {
      values: ["grocery", "tiffin", "hawker"],
      message: "Possible values for vendor type: grocery, tiffin, hawker",
    },
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
    minlength: [10, "phone number should be 10 characters long"],
    maxlength: [10, "phone number should be 10 characters long"],
  },
  geometry: geoSchema,
  items: [itemSchema],
  activeOrders: [orderSchema],
  completedOrders: [orderSchema],
  passwordChanged: Date,
});

vendorSchema.index({ geometry: "2dsphere" });

vendorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

vendorSchema.methods.correctPassword = async function (
  enteredPassword,
  userPassword
) {
  console.log("Correct Password fn");
  return await bcrypt.compare(enteredPassword, userPassword);
};

vendorSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChanged) {
    const changedTimestamp = parseInt(
      this.passwordChanged.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
    // console.log(this.passwordChanged, JWTTimestamp);
  }

  return false;
};

const Vendor = mongoose.model("Vendor", vendorSchema);
module.exports = Vendor;
