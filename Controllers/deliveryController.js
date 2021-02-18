const { request, response } = require("express");
const mongoose = require("mongoose");
const orderSchema = require("../Models/orderModel");
const userSchema = require("../Models/userModel");
const restaurantSchema = require("../Models/restaurantModel");
const foodSchema = require("../Models/foodModel");

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
      } else {
        console.log("someone already accepted the order");
        // Show message to delivery Executive that someone already accepted the order
      }
    } else {
      console.log("you have already accepted one order");
      // Show message to delivery Executive that you have already accepted one order
    }
  } else {
    console.log("order is cancelled you can't accept it");
    // show message to delivery Executive that order is cancelled you can't accept it
  }

  console.log("orderData", orderData);
  response.json(orderData);
};

exports.changeOrderStatus = async (request, response, next) => {
  const deliverExecutiveUserId = request.body.userId;
  const orderId = request.body.orderId;
  const orderStatus = request.body.orderStatus;
  
  const userDataCollection = mongoose.model("user", userSchema, "users");
  const orderDataCollection = mongoose.model("order", orderSchema, "orders");

  var orderData = await orderDataCollection.findById({ _id: orderId });
  const deliveryExecutiveData = await userDataCollection.findById({
    _id: deliverExecutiveUserId,
  });
//   console.log("orderData",orderData);
  if(orderStatus=="Out For Delivery"){
    if(orderData.orderStatus=="Accepted"){
        orderData.changeOrderStatus(orderStatus);
    }else if(orderData.orderStatus=="Out For Delivery"){
        console.log("Order staus is already in out for delivery");
        // Order status is already in out for delivery
    }else{
        console.log("Order is not Accepted by you");
        // Order is not Accepted by you
    }
  }else if(orderStatus=="Completed"){
    const orderOtp=request.body.orderOtp;
    if(orderData.orderStatus=="Out For Delivery"){
        if(orderData.orderOtp==orderOtp){
            orderData.changeOrderStatus(orderStatus);
            deliveryExecutiveData.changeDeliveryExecutiveStatus();
        }else{
            console.log("Order OTP is not valid");
            // Otp is not valid
        }
    }else if(orderData.orderStatus=="Completed"){
        console.log("Order is already completed");
        // order is already completed
    }else {
        console.log("Order is not for out for delivery");
        // Order is not for out for delivery
    }
  }
  response.json(orderData);
};
