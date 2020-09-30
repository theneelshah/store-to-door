const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({});
  if (users.length > 0) {
    res
      .status(201)
      .json({
        status: "OK",
        message: "Users Found",
        totalUsers: users.length,
        users,
      });
  } else {
    res.status(404).json({ status: "Failed", message: "No Users Present" });
  }
});
