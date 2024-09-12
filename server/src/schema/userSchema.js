import { Schema } from "mongoose";

const userSchema = Schema(
  {
    userName: {
      type: String,
      required: [true, "userName field is required."],
    },
    email: {
      type: String,
      required: [true, "email field is required."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password field is required."],
    },
    isVerifiedEmail: {
      type: String,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default userSchema;
