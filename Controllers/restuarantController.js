const { request, response } = require("express");
const mongoose = require("mongoose");
const restaurantSchema = require("../Models/restaurantModel");
const userSchema = require("../Models/restaurantModel");

exports.postRestuarant = async (request, response, next) => {
  console.log("In post Restaurant!");

  // to add restuarant
  const restaurantDataCollection = mongoose.model(
    "restaurant",
    restaurantSchema,
    "restaurants"
  );
  const restuarantObj = new restaurantDataCollection({
    restaurantName: request.body.restaurantName,
    restaurantLocation: request.body.restaurantLocation,
    workingHours: request.body.workingHours,
    activityStatus: request.body.activityStatus,
    restaurantImages: request.body.restaurantImages,
    restaurantCategory: request.body.restaurantCategory,
    restaurantRatings: request.body.restaurantRatings,
    userId: request.body.userId,
    menuDetails: request.body.menuDetails,
  });

  restuarantObj
    .save()
    .then((restaurant) => {
      response.send(restaurant).status(200);
    })
    .catch((error) => {
      console.log("Error:", error);
      next(error);
    });
};

exports.getRestaurants = async (request, response, next) => {
  const restaurantDataCollection = mongoose.model(
    "restaurant",
    restaurantSchema,
    "restaurants"
  );
  const allRestaurantData = await restaurantDataCollection.aggregate([
    {
      $addFields: {
        rating_avg: {
          $avg: {
            $map: {
              input: "$restaurantRatings",
              as: "restRating",
              in: "$$restRating.rating",
            },
          },
        },
      },
    },
  ]);
  console.log(allRestaurantData);
  response.status(200).json(allRestaurantData);
};

exports.getRestaurantsById = async (request, response, next) => {
  const restaurantId = request.params.restaurantId;
  const restaurantDataCollection = mongoose.model(
    "restaurant",
    restaurantSchema,
    "restaurants"
  );
  const restaurantData = await restaurantDataCollection.findById(restaurantId);

  if (restaurantData != null) {
    response.status(200).json(restaurantData);
  } else {
    response.status(400).json({ message: "Restaurant is not available" });
  }
};
