import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/upload.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const uploadRouter = express.Router();
const upload = multer({ dest: "uploads/" }); // Temporary storage for uploaded files

uploadRouter.route("/upload-image").post(isAuthenticated, upload.single("image"), uploadImage);

export default uploadRouter;
