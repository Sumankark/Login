import { config } from "dotenv";

config();

export const port = process.env.PORT || 8080;
export const databaseLink = process.env.DATABASE_LINK;
export const secretKey = process.env.SECRET_KEY;
export const email = process.env.EMAIL;
export const password = process.env.PASSWORD;

if (!databaseLink) {
  throw new Error("DATABASE_LINK environment variable not set.");
}
