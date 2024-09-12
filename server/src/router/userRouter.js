import { Router } from "express";
import {
  createUser,
  Signin,
  verifyUser,
} from "../controller/userController.js";

const userRouter = Router();

userRouter.route("/").post(createUser);
userRouter.route("/verify-user").patch(verifyUser);
userRouter.route("/signin").post(Signin);

export default userRouter;
