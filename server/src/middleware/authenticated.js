import jwt from "jsonwebtoken";
import { secretKey } from "../../config.js";

export const authenticated = (req, res, next) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken || !bearerToken.startsWith(`Bearer `)) {
    return res.status(401).json({
      success: false,
      message: "Authorization token is required.",
    });
  }
  const token = bearerToken.split(" ")[1];
  try {
    let infoObj = jwt.verify(token, secretKey);
    req._id = infoObj._id;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
