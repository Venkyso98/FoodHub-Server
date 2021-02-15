const express = require("express");
const { mongoose } = require("mongoose");

const restuarantController = require("../Controllers/restuarantController");

const router = express.Router(); 

// router.post("/register-restuarant",restuarantController.postRestuarant);

// router.get('/user',userController.getUser);
router.post("/registerrestuarant",restuarantController.postRestuarant);

module.exports = router;
