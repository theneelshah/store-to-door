const express = require("express");
const userRouter = require("./routers/userRouter");
const vendorRouter = require("./routers/vendorRouter");
const app = express();
app.use(express.json());
const globalErrorHandler = require("./controllers/errorController");

app.use("/user", userRouter);
app.use("/vendor", vendorRouter);

app.use(globalErrorHandler);

module.exports = app;
