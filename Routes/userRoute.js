const express = require("express");
const { mongoose } = require("mongoose");

const userController = require("../Controllers/userController");
const userSchema = require("../Models/userModel");

const router = express.Router();

router.post("/registeruser", userController.postUser);
// router.get("/loginuser", userController.loggedInUser);

router.post("/authenticate", userController.authenticate);
router.post("/sendotpforforgotpassword",userController.sendOtpForForgotPassword);
router.post("/resetpassword",userController.resetPassword);

// router.get('/current',authorize(), getCurrent);
// router.get("/:id", authorize(), getById);
// router.post("/cart",userController.postCart);
// router.get('/user',userController.getUser);
module.exports = router;
