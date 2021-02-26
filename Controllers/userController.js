
const { request, response } = require("express");
const mongoose = require("mongoose");
const userSchema = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const sendEmail = require("../Helpers/emailSend");

const userDataCollection = mongoose.model("user", userSchema, "users");

// authentication of the user
exports.authenticate = async (request, response, next) => {
  const email = request.body.email;
  const password = request.body.password;
  const userDataCollection = mongoose.model("user", userSchema, "users");
  const user = await userDataCollection.findOne({ email });

  // generates the jwt token
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    console.log(token);
    return response.status(200).json({ token: token, firstName: user.firstName })

  } else if (!user) {
    response.status(404).json({ message: "User not found" });
  } else {
    response.status(400).json({ message: "User & Password is not match" });
  }
};

exports.postUser = async (request, response, next) => {
  console.log("In Post User Controller");
  const normalUser = new userDataCollection({
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    email: request.body.email,
    password: bcrypt.hashSync(request.body.password, 10),
    birthDate: request.body.birthDate,
    gender: request.body.gender,
    mobileNumber: request.body.mobileNumber,
    role: request.body.role,
  });
  if (request.body.role == "DE") {
    normalUser.deliveryExecutive = request.body.deliveryExecutive;
  }
  normalUser
    .save((err, res) => {
      if (err) {
        //console.log(err);
        response.status(200).json({ message: "User is already exists with this email!!" });
      }
      //console.log(res);
      response.status(201).json({ message: "User Created Successfully" });
    })
};

exports.sendOtpForForgotPassword = async(request,response,next)=>{
  
  const email=request.body.email;
  var userData=await userDataCollection.findOne({email:email});
  if(userData){
    const generatedForgotPasswordOtp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });
    const html = generatedForgotPasswordOtp;
    sendEmail.sendMails([email], "Foodizz Reset Password OTp", html);
    response.status(200).json({forgotPasswordOtp:generatedForgotPasswordOtp,message:"Check you email inbox. OTP Send Succeccfully!!!"});  
  }else{
    response.status(200).json({message:"User is not exist with this email"});  
  }
}

exports.resetPassword = async(request,response,next)=>{
  const email=request.body.email;
  const newPassword=request.body.newPassword;
  var userData=await userDataCollection.findOne({email:email});
  if(userData){
    userData=await userData.resetPassword(bcrypt.hashSync(newPassword, 10));
    // console.log("bcrypt : ",bcrypt.compareSync(newPassword, userData.password))
    // console.log("useData :",userData);

    if(userData){
     response.status(200).json({message:"Your Password is reset successfully"});
    }else{
      response.status(200).json({message:"Your Password is not reset successfully"});
    }
  }else{
    response.status(200).json({message:"Your Password is not reset successfully"});
  }
}