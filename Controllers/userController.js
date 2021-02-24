
const { request, response } = require("express");
const mongoose = require("mongoose");
const userSchema = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// authentication of the user
exports.authenticate = async (request, response, next) => {
  const email = request.body.email;
  const password = request.body.password;
  const userDataCollection = mongoose.model("user", userSchema, "users");
  const user = await userDataCollection.findOne({ email });

  // generates the jwt token
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign( { userId: user._id, role: user.role}, process.env.JWT_SECRET, { expiresIn: "7d" });
    console.log(token);
    return response.status(200).json({token:token,firstName:user.firstName})
    
  }else if(!user){
    response.status(404).json({message:"User not found"}); 
  }else{
    response.status(400).json({message:"User & Password is not match"}); 
  }
};

exports.postUser = (request, response, next) => {
  console.log("In Post User Controller");

  const userDataCollection = mongoose.model("user", userSchema, "users");

  if (request.body.role == "NU" || request.body.role == "RO") {
    const normalUser = new userDataCollection({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: bcrypt.hashSync(request.body.password,10),
      birthDate: request.body.birthDate,
      gender: request.body.gender,
      mobileNumber: request.body.mobileNumber,
      role: request.body.role,
    });

    normalUser
      .save()
      .then((user) => {
        response.send(user).status(201).json({message:"User Created Successfully"});
      })
      .catch((error) => {
        console.log("Error:", error);
        next(error);
      });
  } 
  
  else if (request.body.role == "DE") {

    const deliveryExecutiveUser = new userDataCollection({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: bcrypt.hashSync(request.body.password,10),
      birthDate: request.body.birthDate,
      gender: request.body.gender,
      mobileNumber: request.body.mobileNumber,
      role: request.body.role,
      deliveryExecutive: request.body.deliveryExecutive,
    });

    deliveryExecutiveUser
      .save()
      .then((user) => {
        response.send(user).status(201).json({message:"Delivery Executive Created Successfully"});
      })
      .catch((error) => {
        console.log("Error:", error);
        next(error);
      });
  }
};

// For login the user
// exports.loggedInUser = async (request, response, next) => {
//   const userDataCollection = mongoose.model("user", userSchema, "users");
//   const email = request.body.email;
//   const password = request.body.password;
//   const userObj = await userDataCollection.find({
//     email: email,
//     password: password,
//   });
//   console.log(userObj);
//   response.send(userObj);
// };
