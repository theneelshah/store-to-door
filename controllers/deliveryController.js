const DeliveryPerson = require("../models/deliveryModel");
const User = require("../models/userModel");
const Vendor = require("../models/vendorModel");
const catchAsync = require("../utils/catchAsync");

exports.getNearOrders = catchAsync(async (req, res, next) => {
  const { lat, lng } = req.query;
  if (!lat || !lng)
    return res.status(401).json({
      status: "Failed",
      message: "Please enter both: latitude and longitude",
    });
  const vendors = await Vendor.find({
    geometry: {
      $near: {
        $maxDistance: 2000,
        $geometry: {
          type: "Point",
          coordinates: [lat, lng],
        },
      },
    },
  });
  let nearOrders = [];
  for (let vendor = 0; vendor < vendors.length; vendor += 1) {
    const { activeOrders } = vendors[vendor];
    if (activeOrders.length > 0)
      for (let order = 0; order < activeOrders.length; order += 1) {
        const o = activeOrders[order];
        nearOrders.push(o);
      }
  }
  res
    .status(200)
    .json({ status: "OK", message: "Found Nearby Orders", orders: nearOrders });
});
