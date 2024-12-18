import mongoose from "mongoose";


const registerSchema = new mongoose.Schema(
  {
    username: { type: String,},
    email: { type: String, unique: true },
    password: { type: String}, // Not required for Google OAuth
    googleId: { type: String,}, // Store Google ID for OAuth users
    isVerified: { type: Boolean, default: false }, // Set true for Google OAuth users
    userRole: { type: String, default: "user" }, // Changed 'user' field to 'userRole' for clarity
    currentIp: { type: String },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", registerSchema);

export default userModel;

