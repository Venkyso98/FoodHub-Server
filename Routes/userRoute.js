const express = require("express");
const { mongoose } = require("mongoose");

const userController = require("../Controllers/userController");
const restuarantController = require("../Controllers/restuarantController");

const router = express.Router(); 

router.post("/registeruser",userController.postUser);

router.get("/loginuser",userController.loggedInUser)

// router.post("/cart",userController.postCart);
// router.get('/user',userController.getUser);

module.exports = router;
