const User = require("../models/userModel");
const Vendor = require("../models/vendorModel");

const catchAsync = require("../utils/catchAsync");

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({});
  if (users.length > 0) {
    res.status(201).json({
      status: "OK",
      message: "Users Found",
      totalUsers: users.length,
      users,
    });
  } else {
    res.status(404).json({ status: "Failed", message: "No Users Present" });
  }
});

exports.getUser = catchAsync(async (req, res, next) => {
  const { uid } = req.params;
  const user = await User.findById(uid);
  console.log(user);
  if (!user)
    return res
      .status(404)
      .json({ status: "Failed", message: "Not found with given ID" });

  res.status(200).json({ status: "OK", message: "User Found", user });
});

const matchItemToVendor = async (item) => {
  const matchedVendor = await Vendor.find({ "items._id": item });
  const orderedItem = matchedVendor[0].items.find((el) => el._id == item);

  return {
    vendor: matchedVendor[0]._id,
    item: orderedItem,
  };
};

exports.createOrder = catchAsync(async (req, res, next) => {
  const { item } = req.body;
  const { user } = req;
  const { _id } = user;
  let allOrders = [];
  for (let i = 0; i < item.length; i += 1) {
    let order = await matchItemToVendor(item[i]);
    order.user = _id;
    allOrders.push(order);

    const { vendor } = order;
    const vendorUpdated = await Vendor.findById(vendor);
    const { activeOrders } = vendorUpdated;
    activeOrders.push(order);

    const vendorOrderUpdated = await Vendor.findByIdAndUpdate(
      { _id: vendor },
      { $set: { activeOrders } },
      { new: true, runValidators: true }
    );
    console.log(vendorOrderUpdated);
  }

  const userOrderPlaced = await User.findByIdAndUpdate(
    { _id },
    { $set: { activeOrders: allOrders } },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: "OK",
    message: "Order has been placed!",
    user: userOrderPlaced,
  });
  // console.log(req.user);
});

exports.getOrders = catchAsync(async (req, res, next) => {
  const { user } = req;
  // console.log(user);
  const { _id } = user;
  const { completed } = req.query;
  const currentUser = await User.findById(_id);

  if (completed === "true") {
    const { completedOrders } = currentUser;
    if (completedOrders.length === 0)
      return res
        .status(404)
        .json({ status: "Failed", message: "There are no completed Orders" });

    return res.status(200).json({
      status: "OK",
      message: "Completed Orders",
      orders: completedOrders,
    });
  }
  const { activeOrders } = currentUser;
  if (activeOrders.length === 0)
    return res.status(404).json({
      status: "Failed",
      message: "There are no active orders currently",
    });
  res
    .status(200)
    .json({ status: "OK", message: "Active Orders", orders: activeOrders });
});
