import mongoose from "mongoose";
import { databaseLink } from "../../config.js";

let connectToDB = async () => {
  try {
    await mongoose.connect(databaseLink);
    console.log(
      `Application is connected to database Successfully at ${databaseLink}`
    );
  } catch (error) {
    console.log("Failed to connect to Database", error.message);
  }
};

export default connectToDB;
