const express = require("express");
const userRouter = require("./routers/userRouter");
const app = express();
app.use(express.json());
const globalErrorHandler = require("./controllers/errorController");

app.use("/user", userRouter);

app.use(globalErrorHandler);

module.exports = app;
