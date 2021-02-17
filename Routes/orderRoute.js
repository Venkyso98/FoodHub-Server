const express = require("express");
const { mongoose } = require("mongoose");

const orderController = require("../Controllers/orderController");

const router = express.Router(); 

router.post("/postorder",orderController.postOrder);

// router.post("/cart",userController.postCart);
// router.get('/user',userController.getUser);
router.post("/adddeliveryexecutive",orderController.addDeliveryExecutive);

module.exports = router;
