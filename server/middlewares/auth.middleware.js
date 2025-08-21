import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized. Token missing." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure the decoded token contains the user ID
    if (!decoded._id) {
      return res.status(401).json({ message: "Unauthorized. Invalid token." });
    }

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ message: "Unauthorized. User not found." });
    }

    req.user = {
      _id: user._id,
      isAdmin: user.isAdmin,
    };

    next();
  } catch (error) {
    console.error("Authorization error:", error.message);
    res.status(401).json({ message: "Unauthorized. Invalid or expired token." });
  }
};
