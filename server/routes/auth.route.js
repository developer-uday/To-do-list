import express from "express";
import {
  forgetPassword,
  loginUser,
  registerUser,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { AuthenticationSchema, ForgetPasswordSchema, ResetPasswordSchema } from "../validators/auth.validator.js";
const authRouter = express.Router();

authRouter
  .route("/register")
  .post(validate(AuthenticationSchema), registerUser);
authRouter.route("/login").post(validate(AuthenticationSchema), loginUser);
authRouter.route("/verify-email").post(isAuthenticated, verifyEmail);
authRouter.route("/forget-password").post(validate(ForgetPasswordSchema), forgetPassword);
authRouter.route("/:resetPasswordToken/reset-password").patch(validate(ResetPasswordSchema), resetPassword);

export default authRouter;
