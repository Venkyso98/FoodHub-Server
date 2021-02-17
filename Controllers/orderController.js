const { request, response } = require("express");
const Promise = require("promise");
const mongoose = require("mongoose");
const orderSchema = require("../Models/orderModel");
const userSchema = require("../Models/userModel");
const restaurantSchema = require("../Models/restaurantModel");
const foodSchema = require("../Models/foodModel");

exports.postOrder = async (request, response, next) => {
  const userId = request.body.userId;
  const orderDataCollection = mongoose.model("order", orderSchema, "orders");
  const userDataCollection = mongoose.model("user", userSchema, "users");
  const cartData = await userDataCollection.findById({ _id: userId }, "cart");
  const restaurantDataCollection = mongoose.model(
    "restaurant",
    restaurantSchema,
    "restaurants"
  );
  // const foodDataCollection = mongoose.model("food", foodSchema, "foods");
  var totalAmount = 0;
  const restaurantId = cartData.cart.restaurantId;
  console.log(restaurantId);
  const foodListCart = cartData.cart.foodList;

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
  const orderObj = new orderDataCollection({
    userId: userId,
    orderLocation: request.body.orderLocation,
    totalAmount: totalAmount,
    orderOtp: 123456,
    orderStatus: "Placed",
    foodList: orderFoodList,
    restaurantDetails: restaurantDetails,
  });
  orderObj.save();
  response.json(orderObj);
};

exports.addDeliveryExecutive = async (request, response, next) => {
  const deliverExecutiveUserId = request.body.userId;
  const orderId = request.body.orderId;
  const userDataCollection = mongoose.model("user", userSchema, "users");
  const orderDataCollection = mongoose.model("order", orderSchema, "orders");
  var orderData = await orderDataCollection.findById({ _id: orderId });
  const deliveryExecutiveData = await userDataCollection.findById({
    _id: deliverExecutiveUserId,
  });

  if (orderData.orderStatus != "Cancelled") {
    if (deliveryExecutiveData.deliveryExecutive.deliveryExecutiveStatus) {
      if (orderData.orderStatus == "Placed") {
        orderData.addDeliveryExecutive(deliverExecutiveUserId);
        deliveryExecutiveData.changeDeliveryExecutiveStatus();
      }else{
        console.log("someone already accepted the order")
        // Show message to delivery Executive that someone already accepted the order
      } 
    } else {
      console.log("you have already accepted one order")
      // Show message to delivery Executive that you have already accepted one order
    }
  } else {
    console.log("order is cancelled you can't accept it")
    // show message to delivery Executive that order is cancelled you can't accept it
  }

  console.log("orderData", orderData);
  response.json(orderData);
};
