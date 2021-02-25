const { request, response } = require("express");
const mongoose = require("mongoose");
const orderSchema = require("../Models/orderModel");
const userSchema = require("../Models/userModel");
const restaurantSchema = require("../Models/restaurantModel");
const foodSchema = require("../Models/foodModel");
const auth = require("../Helpers/authApi");

exports.addDeliveryExecutive = async (request, response, next) => {

  auth.authApi(request, response, next);                    // invokes the authenticated api and allows only after user is logged in
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
        response.status(200).json({message:"you have accepted the order"})
      } else {
        console.log("someone already accepted the order");
        response.status(200).json({ message: "someone already accepted the order" });
        // Show message to delivery Executive that someone already accepted the order
      }
    } else {
      console.log("you have already accepted one order");
      response.status(200).json({message:"you have already accepted one order"})
      // Show message to delivery Executive that you have already accepted one order
    }
  } else {
    console.log("order is cancelled you can't accept it");
    response.status(200).json({message:"order is cancelled you can't accept it"})
    // show message to delivery Executive that order is cancelled you can't accept it
  }

  // console.log("orderData", orderData);
  // response.json(orderData);
};

exports.changeOrderStatus = async (request, response, next) => {
  // auth.authApi(request, response, next);
  // const deliverExecutiveId = request.body.userId;
  const deliverExecutiveUserId = "6035ee0a28c5fe5acc33eca3";
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
      response.status(200).json({message:"Order status is changed to out for delivery"})
    }else if(orderData.orderStatus=="Out For Delivery"){
        console.log("Order staus is already in out for delivery");
        // Order status is already in out for delivery
      response.status(200).json({message:"Order status is already in out for delivery"})
    }else{
        console.log("Order is not Accepted by you");
        // Order is not Accepted by you
        response.status(200).json({message:"Order is not Accepted by you"})
    }
  }else if(orderStatus=="Completed"){
    const orderOtp=request.body.orderOtp;
    if(orderData.orderStatus=="Out For Delivery"){
        if(orderData.orderOtp==orderOtp){
            orderData.changeOrderStatus(orderStatus);
          deliveryExecutiveData.changeDeliveryExecutiveStatus();
          response.status(200).json({message:"Order Status Change completed"})
        }else{
            console.log("Order OTP is not valid");
            // Otp is not valid
            response.status(200).json({message:"Otp is not valid"})
        }
    }else if(orderData.orderStatus=="Completed"){
        console.log("Order is already completed");
        // order is already completed
        response.status(200).json({message:"Order is already completed"})
    }else {
        console.log("Order is not for out for delivery");
        // Order is not for out for delivery
        response.status(200).json({message:"Order is not for out for delivery"})
    }
  }
  // response.json(orderData);
};

// get order which is accepted by delivery executive
exports.getOrderDetailAcceptedByDeliveryExecutive = async (request, response, next) => {
  // auth.authApi(request, response, next);
  // const deliverExecutiveId = request.body.userId;
  const deliverExecutiveId = "6035ee0a28c5fe5acc33eca3";
  
  const orderDataCollection = mongoose.model("order", orderSchema, "orders");
  try{
    const orderData = await orderDataCollection.findOne({
      $and: [
        { deliveryExecutive: mongoose.Types.ObjectId(deliverExecutiveId)},
        {
          $or: [
            { orderStatus: "Accepted" },
            { orderStatus: "Out For Delivery" },
          ],
        },
      ],
    });
    console.log(orderData.length);
    if (orderData.length == 0) {
      response
        .status(200)
        .json({ message: "Order not found!!!" });
    } else {
      response.status(200).json(orderData);
    }
  }catch(err){
    response.status(400).json({ message: "Order not found!!!" });
  }
};