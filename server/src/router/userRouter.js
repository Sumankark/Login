import { Router } from "express";
import {
  createUser,
  forgotPassword,
  myProfile,
  resetPassword,
  Signin,
  updatePassword,
  verifyUser,
} from "../controller/userController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { authenticated } from "../middleware/authenticated.js";

const userRouter = Router();

userRouter.route("/").post(createUser);
userRouter.route("/verify-user").patch(verifyUser);
userRouter.route("/signin").post(Signin);
userRouter.route("/forgot-password").post(forgotPassword);
userRouter.route("/reset-password").patch(isAuthenticated, resetPassword);
userRouter.route("/profile").get(authenticated, myProfile);
userRouter.route("/update-password").patch(authenticated, updatePassword);

export default userRouter;
