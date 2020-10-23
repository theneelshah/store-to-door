const app = require("./app");
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const mongoURI = process.env.DB_URL;
const password = process.env.DB_PASSWORD;
const PORT = process.env.PORT || 5949;

const db = mongoURI.replace("<password>", password);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected successfully");
  });

const server = app.listen(PORT, () => {
  console.log(`Server running: Listining on port ${PORT}`);
});

process.on("unhandledRejection", (error) => {
  server.close(() => {
    console.log("Cannot connect to database");
    process.exit(1);
  });
});
