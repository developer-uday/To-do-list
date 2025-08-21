import express from "express";
import {
  completedNote,
  createNote,
  deleteNote,
  getNotes,
  getTotalNotes,
} from "../controllers/note.controller.js";
import { validateNote } from "../middlewares/note.middleware.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
const noteRouter = express.Router();

noteRouter.route("/").get(isAuthenticated, getNotes);
noteRouter
  .route("/create-note")
  .post(isAuthenticated, validateNote, createNote);
noteRouter.route("/:id/complete").patch(isAuthenticated, completedNote);
noteRouter.route("/:id/delete").delete(isAuthenticated, deleteNote);
noteRouter.route("/total").get(isAuthenticated, getTotalNotes);

export default noteRouter;
