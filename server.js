const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRoute = require("./Routes/userRoute");
const cartRoute = require("./Routes/cartRoute");
const restaurantRoute = require("./Routes/restaurantRoute");
const deliveryRoute = require("./Routes/deliveryRoute");
const orderRoute = require("./Routes/orderRoute");

dotenv.config();

app.use(express.json());
app.use("/user", userRoute);
app.use("/cart", cartRoute);
app.use("/restaurant", restaurantRoute);
app.use("/order", orderRoute);
app.use("/delivery", deliveryRoute);

mongoose.connect(
  process.env.CONNECTION_STRING,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) return console.log(err.message);
    console.log("Database Connected!");
    app.listen(5000, () => {
      console.log("Server listening to the port 5000");
    });
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
