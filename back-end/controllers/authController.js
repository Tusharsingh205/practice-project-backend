const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
dotenv.config();


const transporter = nodemailer.createTransport({
  service: "tusharsinghchouhan205@gmail.com",
  auth: {
    user: process.env.EMAIL_USER,
    pass: "upqsyqbnuwtzxodc",
  },
});

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
}

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password,contact, role } = req.body;

    const user = await User.findOne({ email });
    // 1. Check if user already exists
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists ❌" });
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now
   
    const newUser = new User({
      name,
      email,
      password,
      contact,
      role,
      otp,
      otpExpiry
    });

    await newUser.save();

    await transporter.sendMail({
      from: "tusharsinghchouhan205@gmail.com",
      to: email,
      subject: "Verify your email",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });
    res.status(201).json({ message: "User registered, please verify your email ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error ❌" });
  }
};


exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found ❌" });
    }

    if (user.isExpired) {
      return res.status(400).json({ message: "OTP has already been used ❌" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP ❌" });
    }

    if (Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired ❌" });
    }

    user.isExpired = true; // Mark OTP as used
    await user.save();

    res.status(200).json({ message: "Email verified successfully ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error ❌" });
  }
};  


exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found ❌" });
    }
    // if(user.verifyEmail){
    //   return res.status(400).json({ message: "Current OTP is still valid ❌" });
    // }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.isExpired = false; // Reset OTP usage status
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Resend OTP for email verification",
      text: `Your new OTP is ${otp}. It is valid for 10 minutes.`,
    });

    res.status(200).json({ message: "OTP resent successfully ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error ❌" });
  }
};  

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;



    const user = await User.findOne({ email }); 
    if (!user) return res.status(400).json({ message: "User not found ❌" });
    if (!user.isExpired) {
      return res.status(400).json({ message: "Please verify your email before logging in ❌" });
    };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials ❌" });
    }

    // Set user info in session

    req.session.user = {
      id: user._id, 
      name: user.name,
      email: user.email,
    };

    res.status(200).json({ message: "Login successful ✅", user: req.session.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error ❌" });
  }
};

exports.dashboard = (req, res) => {
  res.status(200).json({ message: `Welcome to the dashboard, ${req.session.user.name} ✅` });
}
    
exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error ❌" });
    }
    res.status(200).json({ message: "Logout successful ✅" });
  });
};


// exports.loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // 1. Check fields
//     if (!email || !password) {
//       return res.status(400).json({ message: "Email & password required ❌" });
//     }

//     // 2. Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "User is not register❌",

//       });
//     }

//     const payload = {
//       email: user.email,
//       id: user._id,
//       role: user.role,
//     };

//     if (await bcrypt.compare(password, user.password)) {
//       const token = jwt.sign(payload, process.env.JWT_SECRET, {
//         expiresIn: "1h",
//       });
// console.log(user);
//      const userWithToken = {
//       ...user._doc, // MongoDB object
//       token,        // 👈 user ke andar token
//     };

//       userWithToken.password = undefined; // Hide password
//       console.log(userWithToken);
//       const option = {
//         expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//         httpOnly: true,
//       };
//       res.cookie("token", token, option).status(200).json({
//         success: true,
//         message: "Login successful ✅",
//         userWithToken,
//         token,
//       });
//     } else {
//       return res
//         .status(400)
//         .json({ success: false, message: "Password incorrect ❌" });
//     }
    
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error ❌" });
//   }
// };
