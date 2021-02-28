const express = require("express");
const { mongoose } = require("mongoose");

const auth = require("../Helpers/authApi");
const deliveryController = require("../Controllers/deliveryController");

const router = express.Router(); 

router.post("/adddeliveryexecutive",auth.authAPI,deliveryController.addDeliveryExecutive);
router.post("/changeorderstatus",auth.authAPI,deliveryController.changeOrderStatus);
router.get("/getorderdetailacceptedbydeliveryexecutive", auth.authAPI,deliveryController.getOrderDetailAcceptedByDeliveryExecutive);
router.get("/getdeliveryexecutivepastorders", auth.authAPI,deliveryController.getDeliveryExecutivePastOrders);

module.exports = router;
