import Note from "../models/Note.model.js";

export const getNotes = async (req, res) => {
  const userId = req.user._id; 

  try {
    const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error });
  }
};

export const createNote = async (req, res) => {
  const { title, description } = req.body;

  try {
    const newNote = new Note({
      user: req.user._id,
      title,
      description,
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Error creating note", error });
  }
};

export const completedNote = async (req, res) => {
  const { id } = req.params;

  if (!id || id === "undefined") {
    return res.status(400).json({ message: "Note ID is required." });
  }

  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    note.completed = !note.completed;
    await note.save();
    res.status(200).json(note);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Error updating note", error });
  }
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findByIdAndDelete(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error });
  }
};

// Notes ever created even deleted
export const getTotalNotes = async (req, res) => {
  try {
    const total = await Note.countDocuments(); // Count all notes ever created
    res.status(200).json({ total });
  } catch (error) {
    console.error("Error fetching total notes:", error);
    res.status(500).json({ message: "Error fetching total notes", error });
  }
};
