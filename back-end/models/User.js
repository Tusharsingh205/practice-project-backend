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
    required: true,
      lowercase: true,
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
    role: {
      type: String,
      enum: ["admin", "student","Visitor"],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
