const mongoose = require("mongoose");

// User schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    contact: {
      type: String,
     required: true,
    },
    
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },  
    isExpired: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "student","Visitor"],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
