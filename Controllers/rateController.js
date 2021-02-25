const { request, response } = require("express");
const mongoose = require("mongoose");
const restaurantSchema = require("../Models/restaurantModel");
const userSchema = require("../Models/userModel");
const auth = require("../Helpers/authApi");

const userDataCollection = mongoose.model("user", userSchema, "users");
const restaurantDataCollection = mongoose.model("restaurant", restaurantSchema, "restaurants");

exports.addRatingToDeliveryExecutive = async (request, response, next) => {
   // auth.authApi(request, response, next);
    const userId = request.body.userId;
    const deliveryExecutiveId = request.body.deliveryExecutiveId;
    const rating = request.body.rating;
    const ratingReview = request.body.ratingReview;
    const ratingObj = {
        userId: userId,
        rating: rating,
        ratingReview: ratingReview,
    }
    const ratingData = await userDataCollection.findByIdAndUpdate({_id:deliveryExecutiveId},
        { $push: { "deliveryExecutive.deliveryExecutiveRatings": ratingObj } })
    console.log(ratingData);
    response.json(ratingData);    
}


exports.addRatingToFood = async (request, response, next) => {
    const userId = request.body.userId;
    const foodId = request.body.foodId;
    const restaurantId = request.body.restaurantId;
    const rating = request.body.rating;
    const ratingReview = request.body.ratingReview;
    const ratingObj = {
        userId: userId,
        rating: rating,
        ratingReview: ratingReview,
    }
    const ratingData = await restaurantDataCollection.findOneAndUpdate(
        {$and:[{
            _id: mongoose.Types.ObjectId(restaurantId)},{
            "menuDetails._id": mongoose.Types.ObjectId(foodId)
        }]},
        { $push: { "menuDetails.$.foodRating": ratingObj } }
    );
    console.log(ratingData);
    response.json(ratingData);
}
exports.addRatingToRestaurant = async (request, response, next) => {
    const userId = request.body.userId;
    const restaurantId = request.body.restaurantId;
    const rating = request.body.rating;
    const ratingReview = request.body.ratingReview;
    const ratingObj = {
        userId: userId,
        rating: rating,
        ratingReview: ratingReview,
    }
    const ratingData = await restaurantDataCollection.findByIdAndUpdate({ _id: restaurantId }, { $push: { restaurantRatings: ratingObj } })
    console.log(ratingData);
    response.json(ratingData);
}