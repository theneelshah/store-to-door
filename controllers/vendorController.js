const mongoose = require("mongoose");
const Vendor = require("../models/vendorModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.addItems = catchAsync(async (req, res, next) => {
  const { vid } = req.params;
  const { name, price, images } = req.body;
  console.log(images);
  if (!name || !price)
    return res.status(404).json({
      status: "Failed",
      message: "Please enter all the necessry fields",
    });

  if (typeof name != "string" || typeof price != "number")
    return res
      .status(401)
      .json({ status: "Failed", message: "The types of the fields are wrong" });

  if (images && Array.isArray(images)) {
    const done = await Vendor.updateOne(
      { _id: vid },
      { $push: { items: { name, price, images } } }
    );
    const { n, nModified } = done;
    if (n === 0)
      return res.status(404).json({ status: "Failed", message: "Invalid ID" });

    if (nModified === 0)
      return res.status(401).json({
        status: "Failed",
        message: "Couldn't be modified, try again later",
      });
  } else {
    const done = await Vendor.updateOne(
      { _id: vid },
      { $push: { items: { name, price } } }
    );
    const { n, nModified } = done;
    if (n === 0)
      return res.status(404).json({ status: "Failed", message: "Invalid ID" });

    if (nModified === 0)
      return res.status(401).json({
        status: "Failed",
        message: "Couldn't be modified, try again later",
      });
  }
  res.status(200).json({ status: "OK", message: "Items added, protected Res" });
});

exports.getVendors = catchAsync(async (req, res, next) => {
  const { lat, lng } = req.query;
  if (!lat || !lng)
    return res.status(401).json({
      status: "Failed",
      message: "Please enter both: latitude and longitude",
    });

  const vendors = await Vendor.find({
    geometry: {
      $near: {
        $maxDistance: 1000,
        $geometry: {
          type: "Point",
          coordinates: [lat, lng],
        },
      },
    },
  });
  if (vendors.length > 0)
    return res.status(200).json({
      status: "OK",
      message: `Found vendors near {${lat}, ${lng}}`,
      totalVendors: vendors.length,
      vendors,
    });

  res
    .status(404)
    .json({ status: "Failed", message: "Not found any vendors near you" });
});

exports.getVendor = catchAsync(async (req, res, next) => {
  const { vid } = req.params;
  const vendor = await Vendor.findById(vid);

  if (!vendor)
    return res
      .status(404)
      .json({ status: "Failed", message: "Not found with given ID" });

  const {
    _id,
    username,
    vendorType,
    phone,
    email,
    geometry,
    items,
    activeOrders,
    completedOrders,
  } = vendor;

  let fullActiveOrders = [];
  for (let i = 0; i < activeOrders.length; i += 1) {
    const user = await User.findById(activeOrders[i].user);
    const userActiveOrders = user.activeOrders;

    let userGivenOrder;

    for (let k = 0; k < userActiveOrders.length; k += 1) {
      if (`${userActiveOrders[i].item}` === `${activeOrders[i].item}`)
        userGivenOrder = userActiveOrders[i]._id;
    }

    const { timestamp, quantity, status, item } = activeOrders[i];
    const orderId = activeOrders[i]._id;
    fullActiveOrders.push({
      _id: orderId,
      timestamp,
      status,
      quantity,
      item,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        activeOrderId: userGivenOrder,
      },
    });
  }

  const fullCompletedOrders = [];
  for (let i = 0; i < completedOrders.length; i += 1) {
    const user = await User.findById(completedOrders[i].user);
    const { timestamp, quantity, status, item } = completedOrders[i];
    const orderId = completedOrders[i]._id;
    fullCompletedOrders.push({
      _id: orderId,
      timestamp,
      status,
      quantity,
      item,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });
  }

  res.status(200).json({
    status: "OK",
    message: "User Found",
    vendor: {
      _id,
      username,
      phone,
      email,
      vendorType,
      activeOrders: fullActiveOrders,
      completedOrders: fullCompletedOrders,
      geometry,
      items,
    },
  });
});

exports.updateItems = catchAsync(async (req, res, next) => {
  const { vid, item } = req.params;
  const { name, price, images } = req.body;

  const vendor = await Vendor.findById(vid);
  if (!vendor)
    return res
      .status(404)
      .json({ status: "Failed", message: "User not Found" });
  let found = 0;
  let { items } = vendor;
  for (let el = 0; el < items.length; el += 1) {
    if (items[el]._id == item) {
      const target = items[el];
      target.name = name || target.name;
      target.price = price || target.price;
      for (let img = 0; img < images.length; img += 1)
        target.images.push(images[img]);

      found = 1;
      break;
    }
  }

  if (found === 0)
    return res
      .status(404)
      .json({ status: "Failed", message: "Item not found" });

  const done = await Vendor.findByIdAndUpdate(
    { _id: vid },
    { $set: { items } },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "OK",
    message: "Item updated",
    totalItems: items.length,
    items: done.items,
  });
});

exports.deleteItem = catchAsync(async (req, res, next) => {
  const { vid, item } = req.params;
  const vendor = await Vendor.findById(vid);
  if (!vendor)
    return res
      .status(404)
      .json({ status: "Failed", message: "User not Found" });

  const { items } = vendor;
  let found = 0;
  for (let el = 0; el < items.length; el += 1) {
    if (items[el]._id == item) {
      items.splice(el, 1);
      found = 1;
      break;
    }
  }

  if (found === 0)
    return res
      .status(404)
      .json({ status: "Failed", message: "Item not found" });

  const done = await Vendor.findByIdAndUpdate(
    { _id: vid },
    { $set: { items } },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "Deleted",
    message: "Item Deleted",
    totalItems: done.items.length,
    items: done.items,
  });
});

exports.getItems = catchAsync(async (req, res, next) => {
  const { vid } = req.params;
  const vendor = await Vendor.findById(vid);
  if (!vendor)
    return res
      .status(404)
      .json({ status: "Failed", message: "Not found with given ID" });

  res.status(200).json({
    status: "OK",
    message: "Items found",
    totalItems: vendor.items.length,
    items: vendor.items,
  });
});

exports.getOrders = catchAsync(async (req, res, next) => {
  const { vendor } = req;
  const { activeOrders, completedOrders } = vendor;

  res.status(200).json({
    status: "OK",
    message: "Orders Found",
    activeOrders,
    completedOrders,
  });
});

exports.changeStatus = catchAsync(async (req, res, next) => {
  const { vendor, body } = req;
  const vendorId = vendor._id;
  let vendorActiveOrders = vendor.activeOrders;

  const { itemId, user, vendorActiveId } = body;
  const { _id, userActiveId } = user;

  const userCurrent = await User.findById(_id);

  if (!itemId || !vendorActiveId || !_id || !userActiveId)
    return res
      .status(400)
      .json({ status: "Failed", message: "Please Enter all the fields" });

  for (let i = 0; i < vendorActiveOrders.length; i += 1) {
    if (`${vendorActiveOrders[i]._id}` === `${vendorActiveId}`) {
      vendorActiveOrders[i].status = "Accepted";
      break;
    }
  }

  const vendorUpdated = await Vendor.findByIdAndUpdate(
    { _id: vendorId },
    { $set: { activeOrders: vendorActiveOrders } },
    { new: true, runValidators: true }
  );

  const userActiveOrders = userCurrent.activeOrders;
  for (let i = 0; i < userActiveOrders.length; i += 1) {
    if (`${userActiveOrders[i]._id}` === `${userActiveId}`) {
      userActiveOrders[i].status = "Accepted";
      break;
    }
  }

  const userUpdated = await User.findByIdAndUpdate(
    { _id },
    { $set: { activeOrders: userActiveOrders } },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "Ok",
    message: "Status changed to Accepted",
    vendor: vendorUpdated,
    user: {
      _id: userUpdated._id,
      username: userUpdated.username,
      email: userUpdated.email,
      phone: userUpdated.phone,
      activeOrders: userUpdated.activeOrders,
      completedOrders: userUpdated.completedOrders,
    },
  });
});

exports.changeReject = catchAsync(async (req, res, next) => {
  const { vendor, body } = req;
  const vendorId = vendor._id;
  const vendorActiveOrders = vendor.activeOrders;
  const vendorCompletedOrders = vendor.completedOrders;

  const { itemId, user, vendorActiveId } = body;
  const { _id, userActiveId } = user;

  const userCurrent = await User.findById(_id);

  if (!itemId || !vendorActiveId || !_id || !userActiveId)
    return res
      .status(400)
      .json({ status: "Failed", message: "Please Enter all the fields" });

  for (let i = 0; i < vendorActiveOrders.length; i += 1) {
    if (`${vendorActiveOrders[i]._id}` === `${vendorActiveId}`) {
      const res = vendorActiveOrders.splice(i, 1);
      res[0].status = "rejected";
      vendorCompletedOrders.push(res[0]);
      break;
    }
  }

  const vendorUpdated = await Vendor.findByIdAndUpdate(
    { _id: vendorId },
    {
      $set: {
        activeOrders: vendorActiveOrders,
        completedOrders: vendorCompletedOrders,
      },
    },
    { new: true, runValidators: true }
  );

  const userActiveOrders = userCurrent.activeOrders;
  const userCompletedOrders = userCurrent.completedOrders;

  for (let i = 0; i < userActiveOrders.length; i += 1) {
    if (`${userActiveOrders[i]._id}` === `${userActiveId}`) {
      const res = userActiveOrders.splice(i, 1);
      res[0].status = "rejected";
      userCompletedOrders.push(res[0]);
      break;
    }
  }

  const userUpdated = await User.findByIdAndUpdate(
    { _id },
    {
      $set: {
        activeOrders: userActiveOrders,
        completedOrders: userCompletedOrders,
      },
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "Ok",
    message: "Status changed to Rejected",
    vendor: vendorUpdated,
    user: {
      _id: userUpdated._id,
      username: userUpdated.username,
      email: userUpdated.email,
      phone: userUpdated.phone,
      activeOrders: userUpdated.activeOrders,
      completedOrders: userUpdated.completedOrders,
    },
  });
});
