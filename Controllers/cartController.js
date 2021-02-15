const { request, response } = require("express");
const mongoose = require("mongoose");
const restaurantSchema = require("../Models/restaurantModel");
const userSchema = require("../Models/userModel");

exports.addToCart = async (request, response, next) => {
  console.log("IN add to cart outside");
  const foodId = request.body.foodId;
  const userId = request.body.userId;
  const restaurantId = request.body.restaurantId;
  const userDataCollection = mongoose.model("user", userSchema, "users");
  userDataCollection.findById(userId).then((user) => {
    console.log("IN add to cart");
    response.json(user.addToCart(foodId, restaurantId));
  });
  // console.log(userObj)
  // response.send(userObj);

  // const returnCartObj=await userObj.addToCart(foodId,restaurantId);
  // console.log(returnCartObj)
  // response.send(returnCartObj);
};

exports.reduceQuantity = async (request, response, next) => {
  console.log("In reduceQuantity");
  const foodId = request.body.foodId;
  const userId = request.body.userId;
  const userDataCollection = mongoose.model("user", userSchema, "users");
  userDataCollection.findById(userId).then((user) => {
    console.log("IN reduce item to cart");
    response.json(user.reduceQuantity(foodId));
  });
};

exports.removeFromCart = async (request, response, next) => {
  console.log("In removeFromCart");
  const foodId = request.body.foodId;
  const userId = request.body.userId;
  const userDataCollection = mongoose.model("user", userSchema, "users");
  userDataCollection.findById(userId).then((user) => {
    console.log("IN reduce item to cart");
    response.json(user.removeFromCart(foodId));
  });
};


exports.clearCart= async (request,response,next)=>{
  console.log("In Clear Cart");
  const userId = request.body.userId;
  const userDataCollection = mongoose.model("user", userSchema, "users");
  userDataCollection.findById(userId).then((user) => {
    console.log("IN reduce item to cart");
    response.json(user.clearCart());
  });
}