import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { customError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import {sendingOtpMail,passwordResetMail} from "../utils/mailer.js";
import mongoose from "mongoose";

const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existUserEmail = await User.findOne({ email });
    if (existUserEmail)
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });

    const existUsername = await User.findOne({ username });
    if (existUsername)
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });

    let hashedPassword;

    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }

    const user = new User({ username, email, password: hashedPassword });

    const savedUser = await user.save();

    // registerMail(email,username);

    res.status(201).json({
      success: true,
      user: savedUser,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error while registering user:", error);
    // res.status(500).json({
    //     success: false,
    //     message: "Internal server error"
    // });
    next(customError(500, "Internal server error"));
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const validUser = await User.findOne({ email });
    if (!validUser) return next(customError(404, "User not found"));

    const validPassword = bcrypt.compareSync(password, validUser.password);

    if (!validPassword) return next(customError(401, "Invalid Credentials"));

    const payload = {
      id: validUser._id,
      email: validUser.email,
    };

    const { password: hashedPassword, ...rest } = validUser._doc;
    let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    const options = {
      expires: new Date(Date.now() + 1000 * 60 * 60),
      httpOnly: true,
    };
    res.cookie("access_token", token, options).status(200).json({
      success: true,
      rest,
      token,
      message: "User signed in successfully",
    });
  } catch (error) {
    console.error("Error while logging in user:", error);
    next(customError(500, "Internal server error"));
  }
};

const generatePassword = () => {
  const length = 8;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal.toString();
}

const generateUsername = (name) => {
  return name.split(" ").join("").toLowerCase()+(Math.floor(Math.random() * 1000)).toString();
}

const google = async (req, res, next) => {
  try
  {
    const user = await User.findOne({ email: req.body.email });
    if(user)
    {
      const payload = {
        id: user._id,
        email: user.email,
      };
      let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
      const { password: hashedPassword, ...rest } = user._doc;
      const options = {
        expires: new Date(Date.now() + 1000 * 60 * 60),
        httpOnly: true,
      };
      res.cookie("access_token", token, options).status(200).json({
        success: true,
        rest,
        token,
        message: "User signed in successfully",
      });
    }
    else
    {
      const password = generatePassword();
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username: generateUsername(req.body.name),email : req.body.email, password: hashedPassword, profilePicture : req.body.photo });
      const savedUser = await newUser.save();
      const payload = {
        id: savedUser._id,
        email: savedUser.email,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
      const { password: hashedPwd, ...rest } = savedUser._doc;
      const options = {
        expires: new Date(Date.now() + 1000 * 60 * 60),
        httpOnly: true,
      };
      res.cookie("access_token", token, options).status(200).json({
        success: true,
        rest,
        token,
        message: "User signed in successfully",
      });
    }
  }
  catch (error)
  {
    console.error("Error while logging in user:", error);
    next(customError(500, "Internal server error"));
  } 
}

const signout = (req, res) => {
  res.clearCookie("access_token").status(200).json({
    success: true,
    message: "User signed out successfully",
  });
}

const generateOtp = async (req, res, next) => {
  try{
      const { email } = req.body;
      const user = await User.find({ email: email });
      const user_id = user[0]._id;
      if(user.length === 0) return next(customError(404,'User not found'));
      const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
      sendingOtpMail(email,user[0].username,otp);
      const payload = {
          id: user[0]._id,
          email: email,
          otp: otp,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2m" });
      const options = {
          expires: new Date(Date.now() + 1000 * 60 * 5),
          httpOnly: true,
      };
      res.cookie("otp_token", token, options).status(200).json({
        otp,
        token,
        user_id,
          success: true,
          message: "OTP generated successfully",
      });
  }
  catch(err){
      console.error('Error in generateOtp:', err);
      next(err);
  }
}

const verifyOtp = async (req, res, next) => {
  try{
      const { otp } = req.body;
      const { id, token } = req.params;
      if(!id || !token) return next(customError(401,'Invalid Request'));
      const cookie_token = req.cookies.otp_token;
      if(token !== cookie_token) return next(customError(401,'Invalid URL'));
      const decoded = jwt.verify(cookie_token, process.env.JWT_SECRET);
      if(decoded.otp !== otp) return next(customError(401,'Invalid OTP'));
      if(id !== decoded.id) return next(customError(401,'Invalid URL'));
      const payload = {
          id: decoded.id,
          email: decoded.email,
      };
      const user = await User.findOne({ email: decoded.email });
      if(!user) return next(customError(404,'User not found'));
      const user_id = user._id;
      const resetPassToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5m" });
      const options = {
          expires: new Date(Date.now() + 1000 * 60 * 5),
          httpOnly: true,
      };  
      res.cookie("reset_pass_token", resetPassToken, options).status(200).json({
          resetPassToken,
          user_id,
          success: true,
          message: "OTP verified successfully",
      });
  }
  catch(err){
      console.error('Error in verifyOtp:', err);
      next(err);
  }
}

const resetPassword = async (req, res, next) => {
  try{
    const {password, confirmPassword} = req.body;
    const { id, token } = req.params;
    console.log(typeof id);
    
    if(!id || !token) return next(customError(401,'Invalid Request'));
    if(!mongoose.Types.ObjectId.isValid(id)) return next(customError(401,'Invalid Id'));
    const cookieToken = req.cookies.reset_pass_token;
    if(token !== cookieToken) return next(customError(401,'Invalid URL'));
    const decoded = jwt.verify(cookieToken, process.env.JWT_SECRET);
    if(id !== decoded.id) return next(customError(401,'Invalid URL'));
    if(password !== confirmPassword) return next(customError(401,'Passwords do not match'));
    console.log(decoded);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate({ email: decoded.email }, { password: hashedPassword });
    passwordResetMail(decoded.email,user.username,password);
    if(!user) return next(customError(404,'User not found'));
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  }
  catch(err){
    console.error('Error in resetPassword:', err);
    next(err);
  }
}

export { signup, signin, google, signout,generateOtp, verifyOtp , resetPassword};
