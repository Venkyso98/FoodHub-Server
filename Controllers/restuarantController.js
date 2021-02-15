const { request, response } = require("express");
const mongoose = require("mongoose");
const restaurantSchema = require("../Models/restaurantModel");
const userSchema = require("../Models/restaurantModel");

exports.postRestuarant = async (request, response, next) => {
  console.log("In post Restaurant!");

  // to add restuarant
  const restaurantDataCollection = mongoose.model('restaurant',restaurantSchema,'restaurants');
  const restuarantObj =  new restaurantDataCollection({
    restaurantName: request.body.restaurantName,
    restaurantLocation: request.body.restaurantLocation,
    workingHours: request.body.workingHours,
    activityStatus: request.body.activityStatus,
    restaurantImages: request.body.restaurantImages,
    restaurantRatings: request.body.restaurantRatings,
    userId: request.body.userId,
    menuDetails: request.body.menuDetails,
  });

  restuarantObj.save()
  .then((restaurant) => {
    response.send(restaurant).status(200);
  })
  .catch((error) => {
    console.log("Error:", error);
    next(error);
  });
};