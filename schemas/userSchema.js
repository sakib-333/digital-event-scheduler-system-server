const { Schema, mongoose } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  fullName: {
    type: String,
    required: [true, "Name is required"],
  },
  userType: {
    type: String,
    required: [true, "Name is required"],
    enum: ["general"],
  },
  totalPosts: {
    type: Number,
    default: 0,
  },
  approved: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
