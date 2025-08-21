import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../helper/mail.helper.js";

// User registration
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create a new user
    const newUser = new User({
      email,
      password,
    });

    const savedUser = await newUser.save();

    // Send verification mail
    await sendMail({ email, emailType: "VERIFY", userId: savedUser._id });

    res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};

// User Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate access token
    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // 7 days
    });

    const userData = user.toObject();
    delete userData.password;

    // Sending tokens to the client
    res.status(200).json({ accessToken, user: { ...userData } });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Verify Email
export const verifyEmail = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ error: "Access token is required" });
    }

    // Check if token matches the stored hashed token
    if (
      user.verifyEmailToken !== accessToken ||
      user.verifyEmailTokenExpiry < Date.now()
    ) {
      return res.status(400).json({ error: "Invalid or Expired token" });
    }

    // Update the user's verification status
    user.isVerified = true;
    user.verifyEmailToken = undefined;
    user.verifyEmailTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Error verifying email: ", error.message);
    res.status(500).json({ error: "Failed to verify email" });
  }
};

// Forget Password mail sending
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found", success: false });
    }

    await sendMail({ email, emailType: "RESET", userId: user._id });
    res.status(200).json({
      message: "Reset Password mail sent successfully",
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to send reset password mail", success: false });
    console.error("error: ", error);
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    console.log("this is a debug log");
    const { password, resetPasswordToken } = req.body;
    if (!password || !resetPasswordToken) {
      res.status(404).json({ error: "Credentials not found" });
    }
    const user = await User.findOne({ forgetPasswordToken: resetPasswordToken }).select("+password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if token is valid or not
    if (user.forgetPasswordTokenExpiry < Date.now()) {
      return res.status(400).json({ error: "Token expired" });
    }

    // Compare password
    const isPasswordSame = await bcrypt.compare(password, user.password);
    if (isPasswordSame) {
      return res.status(400).json({ message: "New password cannot be same as old password" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();
    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
