const express = require("express");
const { mongoose } = require("mongoose");

const rateController = require("../Controllers/rateController");

const router = express.Router(); 

// order route for user
router.post("/addratingtofood",rateController.addRatingToFood);
router.post("/addratingtorestaurant",rateController.addRatingToRestaurant);
router.post("/addratingtodeliveryexecutive",rateController.addRatingToDeliveryExecutive);

module.exports = router;                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
