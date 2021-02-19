// const { response, request } = require("express");
const { request, response } = require("express");
const  mongoose = require("mongoose");
const userSchema  = require('../Models/userModel');



exports.postUser = (request, response, next) => {
  console.log("In Post User Controller");

  const userDataCollection = mongoose.model('user',userSchema,'users');

  if (request.body.role == "NU" || request.body.role == "RO" ) {
    const normalUser = new userDataCollection({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: request.body.password,
      birthDate: request.body.birthDate,
      gender: request.body.gender,
      mobileNumber: request.body.mobileNumber,
      role: request.body.role,
    });
     
    normalUser
    .save()
    .then((user) => {
      response.send(user).status(200);
    })
    .catch((error) => {
      console.log("Error:", error);
      next(error);
    });

  } else if (request.body.role == "DE") {
    
      const deliveryExecutiveUser = new userDataCollection({
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        password: request.body.password,
        birthDate: request.body.birthDate,
        gender: request.body.gender,
        mobileNumber: request.body.mobileNumber,
        role: request.body.role,
        deliveryExecutive: request.body.deliveryExecutive,
      });

      deliveryExecutiveUser
      .save()
      .then((user) => {
        response.send(user).status(200);
      })
      .catch((error) => {
        console.log("Error:", error);
        next(error);
      });
  }
  
};

// For login the user
exports.loggedInUser = async (request,response,next)=>{
  const userDataCollection = mongoose.model('user',userSchema,'users');
  const email=request.body.email;
  const password=request.body.password;
  const userObj=await userDataCollection.find({email:email,password:password})
  console.log(userObj)
  response.send(userObj);
}