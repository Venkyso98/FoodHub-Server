const express = require("express");
const { mongoose } = require("mongoose");

const deliveryController = require("../Controllers/deliveryController");

const router = express.Router(); 

router.post("/adddeliveryexecutive",deliveryController.addDeliveryExecutive);
router.post("/changeorderstatus",deliveryController.changeOrderStatus);
router.get("/getorderdetailacceptedbydeliveryexecutive", deliveryController.getOrderDetailAcceptedByDeliveryExecutive);
router.get("/getdeliveryexecutivepastorders", deliveryController.getDeliveryExecutivePastOrders);

module.exports = router;
