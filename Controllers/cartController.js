const { request, response } = require("express");
const mongoose = require("mongoose");
const restaurantSchema = require("../Models/restaurantModel");
const userSchema = require("../Models/userModel");

exports.getCart = async (request, response, next) => {
  const userId = request.body.userId;
  const userDataCollection = mongoose.model("user", userSchema, "users");
  const restaurantDataCollection = mongoose.model(
    "restaurant",
    restaurantSchema,
    "restaurants"
  );

  // fetches the relevent data from cart of userSchema
  const cartData = await userDataCollection.findById({ _id: userId }, "cart");

  // const foodDataCollection = mongoose.model("food", foodSchema, "foods");
  var totalAmount = 0;
  const restaurantId = cartData.cart.restaurantId;
  const foodListCartId = cartData.cart.foodList;

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

  var cartFoodList = []; // for showing in cart with full food detail
  restaurantMenuDetails[0].menuDetails.forEach((food) => {
    var temp = foodListCartId.find((food1) => {
      return food1.foodId.toString() == food._id.toString();
    });
    if (temp != undefined) {
      cartFoodList.push({ foodItem: food, quantity: temp.quantity });
      totalAmount += food.foodPrice * temp.quantity;
    }
  });
  const cartFullData = {
    restaurantDetails: restaurantDetails,
    totalAmount: totalAmount,
    cartFoodList: cartFoodList,
  };
  console.log(cartFullData);
  response.json(cartFullData);
};

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

exports.clearCart = async (request, response, next) => {
  console.log("In Clear Cart");
  const userId = request.body.userId;
  const userDataCollection = mongoose.model("user", userSchema, "users");
  userDataCollection.findById(userId).then((user) => {
    console.log("IN reduce item to cart");
    response.json(user.clearCart());
  });
};
