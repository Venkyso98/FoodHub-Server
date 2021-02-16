const mongoose = require("mongoose");
const addressSchema = require("./addressModel");
const foodSchema = require("./foodModel");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userSchema",
  },
  orderLocation: {
    type: addressSchema,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  orderOtp:{
      type:Number,
      required:true
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ["Placed", "Cancelled", "Accepted", "Completed", "Out For Delivery"],
  },
  orderDateAndTime: {
    type: Date,
    required: true,
    default:Date.now()
  },
  foodList: [
    {
      _id: false,
      foodItem: { type: foodSchema, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  restaurantDetails: {
    restaurantId: {
      type: String,
      required: true,
    },
    restaurantName: {
      type: String,
      required: true,
    },
  },
  deliveryExecutive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userSchema",
  },
});


module.exports = mongoose.model("orderSchema", orderSchema);
