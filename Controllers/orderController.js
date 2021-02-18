const { request, response } = require("express");
const Promise = require("promise");
const mongoose = require("mongoose");
const orderSchema = require("../Models/orderModel");
const userSchema = require("../Models/userModel");
const restaurantSchema = require("../Models/restaurantModel");
const foodSchema = require("../Models/foodModel");
const otpGenerator = require('otp-generator')

// when user places an order
exports.postOrder = async (request, response, next) => {
  const userId = request.body.userId;
  const orderDataCollection = mongoose.model("order", orderSchema, "orders");
  const userDataCollection = mongoose.model("user", userSchema, "users");
  const userData = await userDataCollection.findById({ _id: userId }, "cart");
  const restaurantDataCollection = mongoose.model(
    "restaurant",
    restaurantSchema,
    "restaurants"
  );
  console.log("userDataCart"+userData.cart);
  const cartData=userData.cart;
  var totalAmount = 0;
  const restaurantId = cartData.restaurantId;
  console.log(restaurantId);
  const foodListCart = cartData.foodList;

  const restaurantMenuDetails = await restaurantDataCollection.find(
    { _id: restaurantId },
    "menuDetails restaurantName"
  );
  console.log(restaurantMenuDetails);
  const restaurantDetails = {
    restaurantId: restaurantId,
    restaurantName: restaurantMenuDetails[0].restaurantName,
  };
  console.log("restaurantDetails : ", restaurantDetails);
  var orderFoodList = []; // for order
  restaurantMenuDetails[0].menuDetails.forEach((food) => {
    var temp = foodListCart.find((food1) => {
      return food1.foodId.toString() == food._id.toString();
    });
    if (temp != undefined) {
      orderFoodList.push({ foodItem: food, quantity: temp.quantity });
      totalAmount += food.foodPrice * temp.quantity;
    }
  });
  const generatedOrderOtp =otpGenerator.generate(6, { upperCase: false, specialChars: false ,alphabets:false });
  console.log("Otp:",generatedOrderOtp);
  const orderObj = new orderDataCollection({
    userId: userId,
    orderLocation: request.body.orderLocation,
    totalAmount: totalAmount,
    orderOtp: generatedOrderOtp,
    orderStatus: "Placed",
    foodList: orderFoodList,
    restaurantDetails: restaurantDetails,
  });
  orderObj.save();
  userData.clearCart();

  response.json(orderObj);
};


