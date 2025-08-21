import express from "express";
import {
  countNotesCreated,
  getName,
  getNotesCreated,
  getUserProfileImage,
  saveUserProgress,
  updateName
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.route("/progress").post(isAuthenticated, saveUserProgress);
userRouter
  .route("/count-notes-created")
  .patch(isAuthenticated, countNotesCreated);
userRouter.route("/get-notes-created").get(isAuthenticated, getNotesCreated);
userRouter.route("/update-name").patch(isAuthenticated, updateName);
userRouter.route("/get-name").get(isAuthenticated, getName);
userRouter.route("/get-profile-image").get(isAuthenticated, getUserProfileImage);

export default userRouter;
