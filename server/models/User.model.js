import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: true,
      select: false,
      length: {
        min: 8,
        max: 128,
      },
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
      max: 100,
    },
    xp: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    maxXp: {
      type: Number,
      default: 100,
    },
    profileImage: {
      type: String,
    },
    totalNotesCreated: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    forgetPasswordToken: String,
    forgetPasswordTokenExpiry: Date,
    verifyEmailToken: String,
    verifyEmailTokenExpiry: Date,
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password
userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
