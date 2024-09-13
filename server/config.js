import { config } from "dotenv";

// load environment variables from .env file
config();

export const port = process.env.PORT || 8080;
export const databaseLink = process.env.DATABASE_LINK;
export const secretKey = process.env.SECRET_KEY;
export const email = process.env.EMAIL;
export const password = process.env.PASSWORD;

// check the databaseLink and throw error.
if (!databaseLink) {
  throw new Error("DATABASE_LINK environment variable not set.");
}
