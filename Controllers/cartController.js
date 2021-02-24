const { request, response } = require("express");
const mongoose = require("mongoose");
const restaurantSchema = require("../Models/restaurantModel");
const userSchema = require("../Models/userModel");
const auth = require("../Helpers/authApi");

exports.getCart = async (request, response, next) => {

  auth.authApi(request, response, next);                    // invokes the authenticated api and allows only after user is logged in

  const userId = request.body.userId;
  console.log("User ID", userId);
  const userDataCollection = mongoose.model("user", userSchema, "users");
  const restaurantDataCollection = mongoose.model(
    "restaurant",
    restaurantSchema,
    "restaurants"
  );

  // fetches the relevent data from cart of userSchema
  const cartData = await userDataCollection.findById({ _id: userId }, "cart");
  console.log("Cart Data", cartData);
  if (
    cartData.cart.restaurantId == null ||
    cartData.cart.restaurantId == undefined
  ) {
    console.log("Restaurant Id in if cart", cartData.cart.restaurantId);
    response.status(200).json({ message: "Your Cart is Empty" });

  } else {
    if (cartData.cart.foodList.length == 0) {
      console.log("FoodList in if cart", cartData.cart.foodList);
      response.status(200).send({ message: "Your Haven't add any food" });
    } else {
      console.log("FoodList in else cart", cartData.cart.foodList);
      console.log("Restaurant Id in else cart", cartData.cart.restaurantId);
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
      response.status(200).json(cartFullData);
    }
  }
};

exports.addToCart = async (request, response, next) => {
  console.log("IN add to cart outside");
  auth.authApi(request, response, next);                      // authenticated api 
  const foodId = request.body.foodId;
  if (foodId == undefined || foodId == null) {
    response.status(400).json({ message: "Food is not added" });
  }
  const userId = request.body.userId;
  const restaurantId = request.body.restaurantId;
  const userDataCollection = mongoose.model("user", userSchema, "users");

  userDataCollection.findById(userId).then((user) => {
    console.log("IN add to cart");
    console.log(user.addToCart(foodId, restaurantId));
    response.status(200).json({ message: "Food added Succefully" });
  });
};

exports.reduceQuantity = async (request, response, next) => {

  auth.authApi(request, response, next);                      // authenticated api gets the userId and role
  console.log("In reduceQuantity");
  const foodId = request.body.foodId;
  const userId = request.body.userId;
  const userDataCollection = mongoose.model("user", userSchema, "users");
  userDataCollection.findById(userId).then((user) => {
    console.log("IN reduce item to cart");
    user.reduceQuantity(foodId);
    response.status(200).json({ message: "Quantity Decreased Successfully" });
  });
};

exports.removeFromCart = async (request, response, next) => {
  auth.authApi(request, response, next);  
  console.log("In removeFromCart");
  const foodId = request.body.foodId;                            // authenticated api gets the userId and role
  const userId = request.body.userId;
  const userDataCollection = mongoose.model("user", userSchema, "users");
  userDataCollection.findById(userId).then((user) => {
    console.log("IN reduce item to cart");
    user.removeFromCart(foodId);
    response.status(200).json({ message: "Food Item removed from cart" });
  });
};

exports.clearCart = async (request, response, next) => {
  auth.authApi(request, response, next);                     // authenticated api gets the userId and role
  console.log("In Clear Cart");
  const userId = request.body.userId;
  const userDataCollection = mongoose.model("user", userSchema, "users");       // accessing the model
  userDataCollection.findById(userId).then((user) => {
    console.log("IN reduce item to cart");
    user.clearCart();
    response.status(200).json({ message: "Cart Cleared Successfully" });
  });
};
