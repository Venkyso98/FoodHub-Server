const { request, response } = require("express");
const Promise = require("promise");
const mongoose = require("mongoose");
const orderSchema = require("../Models/orderModel");
const userSchema = require("../Models/userModel");
const restaurantSchema = require("../Models/restaurantModel");
const foodSchema = require("../Models/foodModel");

exports.postOrder = async (request, response, next) => {
  const userId = request.body.userId;
  const userDataCollection = mongoose.model("user", userSchema, "users");
  const cartData = await userDataCollection.findById({ _id: userId }, "cart");
  const restaurantDataCollection = mongoose.model(
    "restaurant",
    restaurantSchema,
    "restaurants"
  );
  const foodDataCollection = mongoose.model("food", foodSchema, "foods");
  var totalAmount = 0;
  const restaurantId = cartData.cart.restaurantId;
  // console.log(restaurantId);
  const foodListCart = cartData.cart.foodList;
  // console.log("CardLisdt:",foodListDoc);
  const menuDetails = await restaurantDataCollection.find(
    { _id: restaurantId }, 'menuDetails'
  );
  // console.log(menuDetails)
  
  var foodLists =[];
  menuDetails[0].menuDetails.forEach((food) => {
    console.log("FoodId", food);
    var temp =foodListCart.find((food1) => { 
      console.log("food1",food1);
      return food1.foodId.toString() == food._id.toString();
    });
    if(temp!=undefined)
    {
      foodLists.push({foodItem:food,quantity:temp.quantity});
    }
  })
  console.log("foodList", foodLists);
  
  response.json(menuDetails);
  // restaurantDataCollection
  //   .findOne({ _id: restaurantId }, "menuDetails")
  //   .then((menuDetails) => {
  //     return menuDetails.menuDetails;
  //   })
  //   .then((menuDetails) => {
  //     var innerFoodList=foodListCart.map((food) => {
  //       return menuDetails.filter(
  //         (menuDetail) => food.foodId == menuDetail._id
  //       );
  //     });
  //     console.log("Inner FoodList",innerFoodList);
  //     return innerFoodList;
  //   })
  //   .then((foodList) => {
  //     console.log("FoodList :", foodList);
  //     response.send(foodList);
  //   });
  // console.log(menuDetails);
  // var foodLists=await foodListDoc.map((food)=>{
  //   return menuDetails.filter((menuDetail)=>food.foodId==menuDetail._id);
  //   })
  // console.log(foodLists);
  // response.json(foodLists);

  // foodListDoc.map(async (food) => {
  //   var foodList=await restaurantDataCollection.findOne(
  //     { menuDetails: { $elemMatch: { _id: food.foodId } } },
  //     "menuDetails"
  //   );
  //   // foodLists.push(foodList);
  //   console.log(foodList.menuDetails[0]);

  // console.log(foodList);
  // });
  //   Promise.all(foodList).then(response.json(foodList));

  // const orderDataCollection = mongoose.model('order',orderSchema,'orders');
  // const orderObj=new orderDataCollection({
  //     userId: request.body.userId,
  //     orderLocation: request.body.orderLocation,
  //     totalAmount:request.body.totalAmount,
  //     orderOtp:123456,
  //     orderStatus: "Placed",
  //     foodList: request.body.foodList,
  //     restaurantDetails:"",
  // })
};
