import { secretKey } from "../../config.js";
import bcrypt from "bcryptjs";
import { User } from "../schema/model.js";
import axios from "axios";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

export const createUser = async (req, res) => {
  const { userName, email, password, recaptchaToken } = req.body;

  // Validation errors accumulator
  const errors = [];

  // Check if required fields are provided
  if (!userName || !email || !password || !recaptchaToken) {
    errors.push("All fields are required.");
  }

  // Validate username
  if (userName && userName.length < 3) {
    errors.push("UserName must be at least 3 characters long.");
  }

  // Validate email domain (only Gmail allowed)
  const emailDomain = email.split("@")[1];
  if (emailDomain !== "gmail.com") {
    errors.push("Only Gmail addresses are allowed.");
  }

  // Return if any validation errors exist
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  try {
    // Check if username or email already exists in the database
    const [existingUserName, existingEmail] = await Promise.all([
      User.findOne({ userName }),
      User.findOne({ email }),
    ]);

    if (existingUserName) {
      return res.status(400).json({
        success: false,
        message: "UserName already exists.",
      });
    }

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Verify reCAPTCHA token using Google's API
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaToken}`;
    const captchaResponse = await axios.post(verificationUrl);

    if (!captchaResponse.data.success) {
      return res
        .status(400)
        .json({ success: false, message: "reCAPTCHA validation failed" });
    }

    // Hash the password using bcrypt
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user object for the database
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
      isVerifiedEmail: false,
    });

    // Save the new user to the database
    const result = await User.create(newUser);

    // Create a JWT token for email verification
    const token = jwt.sign({ id: result._id }, secretKey, { expiresIn: "3d" });

    // Send verification email to the user
    await sendEmail({
      from: "'Houseobj' <karkisuman0627@gmail.com>",
      to: email,
      subject: "Account Creation",
      html: `
        <h1>Your account has been created successfully</h1>
        <p>Click the link below to verify your email:</p>
        <a href="http://localhost:3000/verify-email?token=${token}">
          Verify your email
        </a>
      `,
    });

    // Send a success response
    return res.status(201).json({
      success: true,
      message:
        "Sign Up Successfully. Please check your email and verify your account.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString) {
      return res.status(400).json({
        success: false,
        message: "Authorization token is required.",
      });
    }

    const token = tokenString.split(" ")[1];
    const infoObj = jwt.verify(token, secretKey);
    const userId = infoObj.id;

    const result = await User.findByIdAndUpdate(
      userId,
      { isVerifiedEmail: true },
      { new: true }
    );

    if (!result) {
      res.status(404).json({
        success: false,
        message: "User does found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User Verified Successfully.",
      result,
    });
  } catch (error) {
    console.error("Verification failed: ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const Signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    if (!user.isVerifiedEmail) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first.",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const infoObj = { _id: user._id };
    const expireInfo = { expiresIn: "365d" };
    const token = jwt.sign(infoObj, secretKey, expireInfo);

    res.status(200).json({
      success: true,
      message: "User signed in successfully.",
      result: user,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email, recaptchaToken } = req.body;

  try {
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      const token = jwt.sign({ id: existingEmail._id }, secretKey, {
        expiresIn: "3d",
      });

      // Verify reCAPTCHA token
      const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
      const captchaResponse = await axios.post(verificationUrl);

      if (!captchaResponse.data.success) {
        return res
          .status(400)
          .json({ success: false, message: "reCAPTCHA validation failed" });
      }

      await sendEmail({
        from: "'Houseobj' <karkisuman0627@gmail.com>",
        to: email,
        subject: "Reset Password",
        html: `
                <h1> Click the link to reset password </h1>
    
                <a href="http://localhost:3000/reset-password?token=${token}">http://localhost:3000/reset-password?token=${token}</a>
                `,
      });
      res.status(200).json({
        success: true,
        message: "To Reset Password link has been send to your email",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Email does not exists.",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const _id = req._id;
    const { recaptchaToken, password } = req.body;

    if (!password || !recaptchaToken) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // Verify reCAPTCHA token
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
    const captchaResponse = await axios.post(verificationUrl);

    if (!captchaResponse.data.success) {
      return res
        .status(400)
        .json({ success: false, message: "reCAPTCHA validation failed" });
    }

    const user = await User.findById(_id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const result = await User.findByIdAndUpdate(
      _id,
      { password: hashPassword },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "password reset Successfully.",
      result: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  const _id = req._id;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  try {
    const data = await User.findById(_id);
    const hashPassword = data.password;

    const isValidPassword = await bcrypt.compare(oldPassword, hashPassword);

    if (isValidPassword) {
      const newHashPassword = await bcrypt.hash(newPassword, 10);

      await User.findByIdAndUpdate(
        _id,
        { password: newHashPassword },
        { new: true }
      );
      res.status(201).json({
        success: true,
        message: "password update successfully.",
      });
    } else {
      const error = new Error("Credential does not match");
      throw error;
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const myProfile = async (req, res) => {
  try {
    const _id = req._id;
    const result = await User.findById(_id);
    res.status(200).json({
      success: true,
      message: "profile read Successfully",
      result: result,
    });
  } catch (error) {
    res.json(400).status({
      success: false,
      message: error.message,
    });
  }
};
