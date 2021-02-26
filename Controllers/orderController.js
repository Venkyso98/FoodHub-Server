const {
  request,
  response
} = require("express");
const Promise = require("promise");
const mongoose = require("mongoose");
const orderSchema = require("../Models/orderModel");
const userSchema = require("../Models/userModel");
const restaurantSchema = require("../Models/restaurantModel");
const foodSchema = require("../Models/foodModel");
const otpGenerator = require("otp-generator");
const auth = require("../Helpers/authApi");
const nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const sendEmail = require("../Helpers/emailSend");

// when user places an order
exports.postOrder = async (request, response, next) => {

  console.log("In post ORDER====================");

  auth.authApi(request, response, next);
  const userId = request.body.userId;
  console.log("User ID", userId);

  const orderDataCollection = mongoose.model("order", orderSchema, "orders");
  const userDataCollection = mongoose.model("user", userSchema, "users");
  const userData = await userDataCollection.findById({
      _id: userId
    },
    "cart email"
  );
  const restaurantDataCollection = mongoose.model(
    "restaurant",
    restaurantSchema,
    "restaurants"
  );
  console.log("userDataCart=============" + userData.cart);
  if (userData.cart.foodList == null || userData.cart.restaurantId == "") {
    response.status(400).json({
      message: "Cart doesn't contain any items"
    });
  } else {
    const cartData = userData.cart;
    var totalAmount = 0;
    const restaurantId = cartData.restaurantId;
    console.log(restaurantId);
    const foodListCart = cartData.foodList;

    const restaurantMenuDetails = await restaurantDataCollection.findOne({
        _id: restaurantId
      },
      "menuDetails restaurantName restaurantLocation restaurantImages"
    );
    console.log(restaurantMenuDetails);
    const restaurantDetails = {
      restaurantId: restaurantId,
      restaurantName: restaurantMenuDetails.restaurantName,
      restaurantLocation: restaurantMenuDetails.restaurantLocation,
      restaurantImages: restaurantMenuDetails.restaurantImages
    };
    console.log("restaurantDetails : ", restaurantDetails);
    var orderFoodList = []; // for order
    restaurantMenuDetails.menuDetails.forEach((food) => {
      var temp = foodListCart.find((food1) => {
        return food1.foodId.toString() == food._id.toString();
      });
      if (temp != undefined) {
        orderFoodList.push({
          foodItem: food,
          quantity: temp.quantity
        });
        totalAmount += food.foodPrice * temp.quantity;
      }
    });

    // OTP Generation.
    const generatedOrderOtp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });
    console.log("Otp:", generatedOrderOtp);

    const orderObj = new orderDataCollection({
      userId: userId,
      orderLocation: request.body.orderLocation,
      totalAmount: totalAmount,
      orderOtp: generatedOrderOtp,
      orderStatus: "Placed",
      foodList: orderFoodList,
      restaurantDetails: restaurantDetails,
    });
    orderObj
      .save()
      .then((order) => {
        console.log("Order is===", order);

        const html = generatedOrderOtp;
        sendEmail.sendMails([userData.email], "Foodizz Order otp", html);
        // sends the mail to the user
        userData.clearCart();
        response
          .status(201)
          .json({
            message: "Order created Successfully",
            orderObj
          });
      })
      .catch((err) => {
        console.log(err);
        response.status(500).json({
          message: "Internal Server Error",
          error: err,
        });
      });
  }
};

// get all order of user
exports.getUserOrder = async (request, response, next) => {
  auth.authApi(request, response, next);
  const userId = request.body.userId;
  const orderDataCollection = mongoose.model("order", orderSchema, "orders");
  const userDataCollection = mongoose.model("user", userSchema, "users");
  const userOrderData = await orderDataCollection.find({
    $and: [{
        userId: userId
      },
      {
        $or: [{
            orderStatus: "Cancelled"
          },
          {
            orderStatus: "Completed"
          },
        ],
      },
    ]
  });
  response.status(200).json(userOrderData);
  console.log(userOrderData);
}

// track user order
exports.getUserTrackOrder = async (request, response, next) => {
  auth.authApi(request, response, next);
  const userId = request.body.userId;
  const orderDataCollection = mongoose.model("order", orderSchema, "orders");
  const userOrderData = await orderDataCollection.find({
    $and: [{
        userId: userId
      },
      {
        $or: [{
            orderStatus: "Placed"
          },
          {
            orderStatus: "Accepted"
          },
          {
            orderStatus: "Out For Delivery"
          },
        ],
      },
    ],
  });
  console.log(userOrderData.length);
  if (userOrderData.length == 0) {
    response
      .status(200)
      .json({
        message: "You haven't placed any order yet!!!"
      });
  } else {
    response.status(200).json(userOrderData);
  }
};

//show perticular one order for summary
exports.getOrderDetailByOrderId = async (request, response, next) => {
  auth.authApi(request, response, next);
  const userId = request.body.userId;
  // const orderId = request.body.orderId
  const orderId = request.params.orderId
  const userDataCollection = mongoose.model("user", userSchema, "users");

  const orderDataCollection = mongoose.model("order", orderSchema, "orders");
  try {
    const orderData = await orderDataCollection.findOne({
      $and: [{
          userId: mongoose.Types.ObjectId(userId)
        },
        {
          _id: mongoose.Types.ObjectId(orderId)
        }
      ],
    });
    
    console.log('order daata ==============', orderData);
    if (orderData==null) {
      response
        .status(200)
        .json({
          message: "Order not found!!!"
        });
    } else {
      if(orderData.deliveryExecutive!=undefined){
        const deliveryExecutiveData=await userDataCollection.findById(mongoose.Types.ObjectId(orderData.deliveryExecutive),'firstName lastName mobileNumber deliveryExecutive.vehicleNumber');
        console.log(deliveryExecutiveData);
        response.status(200).json({orderData:orderData,deliveryExecutiveData:deliveryExecutiveData});
      }else{
        response.status(200).json({orderData:orderData});
      }
    }
  } catch (err) {
    console.log('Error =======================', err);
    response.status(400).json({
      message: "Order not found!!!"
    });
  }
};
//************ order route api for delivery executive */

exports.getPlacedOrderForDeliveryExecutive = async (request, response, next) => {
  //auth.authApi(request, response, next);
  //const deliverExecutiveId = request.body.userId;
  const deliverExecutiveId = "6035ee0a28c5fe5acc33eca3";
  const userDataCollection = mongoose.model("user", userSchema, "users");
  const orderDataCollection = mongoose.model("order", orderSchema, "orders");
  const deliveryExecutiveData = await userDataCollection.findById({
    _id: mongoose.Types.ObjectId(deliverExecutiveId)
  }, 'deliveryExecutive.deliveryExecutiveLocation.city');

  console.log("Order status:", deliveryExecutiveData);
  console.log("Order City", deliveryExecutiveData.deliveryExecutive.deliveryExecutiveLocation.city);
  const orderCity = deliveryExecutiveData.deliveryExecutive.deliveryExecutiveLocation.city;
  try {
    const orderData = await orderDataCollection.find({
      $and: [{
          "orderLocation.city": orderCity
        },
        {
          orderStatus: "Placed"
        },
      ],
    });
    console.log(orderData);
    if (orderData.length == 0) {
      response
        .status(200)
        .json({
          message: "No order found in your city!!!"
        });
    } else {
      response.status(200).json(orderData);
    }
  } catch (err) {
    response.status(400).json({
      message: "No order found in your city!!!"
    });
  }
}

