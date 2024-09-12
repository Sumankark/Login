import { model } from "mongoose";
import userSchema from "./userSchema.js";

export const User = model("User", userSchema);
