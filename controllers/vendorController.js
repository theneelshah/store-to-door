const Vendor = require("../models/vendorModel");
const catchAsync = require("../utils/catchAsync");

exports.addItems = catchAsync(async (req, res, next) => {
  res.status(200).json({ status: "OK", message: "Items added, protected Res" });
});
