const express = require("express");
const {
    mongoose
} = require("mongoose");

const cartController = require("../Controllers/cartController");

const router = express.Router();

// router.post("/register-restuarant",restuarantController.postRestuarant);

// router.get('/user',userController.getUser);
router.post("/addtocart", cartController.addToCart);
router.post("/reducequantitytocart", cartController.reduceQuantity);
router.post("/removefromcart", cartController.removeFromCart);
router.post("/clearcart", cartController.clearCart);
router.get("/getcart", cartController.getCart);

module.exports = router;