import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 15,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Note = mongoose.model("Note", noteSchema);
export default Note;
