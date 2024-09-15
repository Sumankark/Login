import { Router } from "express";
import {
  createUser,
  forgotPassword,
  resetPassword,
  Signin,
  verifyUser,
} from "../controller/userController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const userRouter = Router();

userRouter.route("/").post(createUser);
userRouter.route("/verify-user").patch(verifyUser);
userRouter.route("/signin").post(Signin);
userRouter.route("/forgot-password").post(forgotPassword);
userRouter.route("/reset-password").patch(isAuthenticated, resetPassword);

export default userRouter;
