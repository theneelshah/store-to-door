const mongoose = require("mongoose");
const { findByIdAndUpdate } = require("../models/vendorModel");
const Vendor = require("../models/vendorModel");
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
  const vendors = await Vendor.find({});
  if (vendors.length > 0) {
    return res.status(201).json({
      status: "OK",
      message: "Vendors Found",
      totalUsers: vendors.length,
      vendors,
    });
  } else {
    res.status(404).json({ status: "Failed", message: "No Vendors Present" });
  }
});

exports.getVendor = catchAsync(async (req, res, next) => {
  const { vid } = req.params;
  const vendor = await Vendor.findById(vid);
  if (!vendor)
    return res
      .status(404)
      .json({ status: "Failed", message: "Not found with given ID" });

  res.status(200).json({ status: "OK", message: "User Found", vendor });
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

  res
    .status(200)
    .json({
      status: "OK",
      message: "Items found",
      totalItems: vendor.items.length,
      items: vendor.items,
    });
});
