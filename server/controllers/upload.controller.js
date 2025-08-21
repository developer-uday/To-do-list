import cloudinary from "../config/cloudinary.config.js";
import User from "../models/User.model.js";

export const uploadImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("File received:", file); // Debug log

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `user_images/${req.user._id}`, // Organize images by user ID
    });

    console.log("Cloudinary upload result:", result); // Debug log

    // Update user's profile image in the database
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: result.secure_url },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Image uploaded successfully",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Error uploading image:", error); // Debug log
    res.status(500).json({ message: "Error uploading image", error });
  }
};
