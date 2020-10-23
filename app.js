const express = require("express");
const cors = require("cors");
const userRouter = require("./routers/userRouter");
const vendorRouter = require("./routers/vendorRouter");
const deliveryRouter = require("./routers/deliveryRouter");

const app = express();
app.use(cors());
app.use(express.json());
const globalErrorHandler = require("./controllers/errorController");

app.use("/user", userRouter);
app.use("/vendor", vendorRouter);
app.use("/delivery", deliveryRouter);

app.use(globalErrorHandler);

module.exports = app;
