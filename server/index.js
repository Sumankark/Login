import express, { json } from "express";
import { port } from "./config.js";
import cors from "cors";
import connectToDB from "./src/database/ConnectToDB.js";
import userRouter from "./src/router/userRouter.js";

const expressApp = express();

expressApp.listen(port, () => {
  console.log(`Express app is listen at port ${port}`);
});

expressApp.use(cors());
expressApp.use(json());

connectToDB();

expressApp.use("/users", userRouter);
