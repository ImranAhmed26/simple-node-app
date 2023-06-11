import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    userName: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      minLength: [3, "Name is too short"],
      maxLength: [32, "Name is too long"],
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Too Small to be secure"],
    },
    userId: { type: String, unique: true, required: [true, "Missing unique ID Number"] },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
