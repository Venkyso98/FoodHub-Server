const express = require("express");
const { mongoose } = require("mongoose");

const orderController = require("../Controllers/orderController");

const router = express.Router(); 

// order route for user
router.post("/postorder",orderController.postOrder);
router.get("/getuserorder",orderController.getUserOrder);
router.get("/getusertrackorder",orderController.getUserTrackOrder);
router.get("/getorderdetailbyorderid/:orderId",orderController.getOrderDetailByOrderId);
// router.get("/getorderdetailbyorderid",orderController.getOrderDetailByOrderId);

// order route for delivery executive
router.get("/getplacedorderfordeliveryexecutive",orderController.getPlacedOrderForDeliveryExecutive);



module.exports = router;                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
