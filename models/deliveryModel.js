const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const deliverySchema = mongoose.Schema({
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
});

deliverySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

deliverySchema.methods.correctPassword = async function (
  enteredPassword,
  userPassword
) {
  console.log("Correct Password fn");
  return await bcrypt.compare(enteredPassword, userPassword);
};

deliverySchema.methods.changedPasswordAfter = function (JWTTimestamp) {
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

const DeliveryPerson = mongoose.model("deliveryPerson", deliverySchema);
module.exports = DeliveryPerson;
