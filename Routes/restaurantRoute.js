const express = require("express");
const { mongoose } = require("mongoose");

const restaurantController = require("../Controllers/restuarantController");

const router = express.Router(); 


router.post("/registerrestaurant",restaurantController.postRestuarant);
router.get("/getrestaurants",restaurantController.getRestaurants);
router.get("/getrestaurantbyid/:restaurantId",restaurantController.getRestaurantsById);

module.exports = router;
