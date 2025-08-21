import User from "../models/User.model.js";

export const saveUserProgress = async (req, res) => {
  const { level, xp, maxXp } = req.body;

  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }
    await User.findByIdAndUpdate(userId, { level, xp, maxXp });

    res.status(200).json({ message: "Progress saved successfully" });
  } catch (error) {
    console.error("Error saving user progress:", error);
    res.status(500).json({ message: "Error saving progress", error });
  }
};

export const countNotesCreated = async (req, res) => {
  try {
    const userId = req.user._id;

    // Increment the total notes counter for the user
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { totalNotesCreated: 1 } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Total notes incremented successfully",
      totalNotesCreated: user.totalNotesCreated,
    });
  } catch (error) {
    console.error("Error incrementing total notes:", error);
    res.status(500).json({ message: "Error incrementing total notes", error });
  }
};

export const getNotesCreated = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch the total notes created by the user
    const user = await User.findById(userId).select("totalNotesCreated");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ totalNotesCreated: user.totalNotesCreated });
  } catch (error) {
    console.error("Error fetching total notes created:", error);
    res.status(500).json({ message: "Error fetching total notes", error });
  }
};

export const updateName = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: "Name cannot be empty." });
  }

  try {
    const userId = req.user._id;

    // Update the user's name in the database
    const user = await User.findByIdAndUpdate(
      userId,
      { name: name.trim() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Name updated successfully.", user });
  } catch (error) {
    console.error("Error updating name:", error);
    res.status(500).json({ message: "Error updating name.", error });
  }
};

export const getName = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("name");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ name: user.name });
  } catch (error) {
    console.error("Error fetching name", name);
    res.status(500).json({ message: "Error fetching name", error });
  }
};

export const getUserProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      name: user.name,
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile", error });
  }
};