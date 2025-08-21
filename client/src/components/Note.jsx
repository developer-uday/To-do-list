import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const Note = ({
  id,
  text,
  description,
  completed,
  createdAt,
  onToggle,
  onDelete,
}) => {
  const handleToggle = async () => {
    try {
      const res = await axiosInstance.patch(`/notes/${id}/complete`);
      onToggle(res.data);
      toast.success("Note status updated!");
    } catch (error) {
      console.error("Error toggling note:", error);
      toast.error("Failed to update note status.");
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/notes/${id}/delete`);
      onDelete();
      toast.success("Note deleted successfully!");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note.");
    }
  };

  const getFormattedDate = () => {
    try {
      return new Date(createdAt).toLocaleDateString("en-IN");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return (
    <div
      className={`flex items-center justify-between border p-3 ${
        completed ? "text-[#aaa]" : "text-white"
      }`}
    >
      <div className="flex-1 flex flex-col">
        <span className={`${completed ? "line-through" : ""} font-semibold`}>
          {text}{" "}
          <span
            className={`text-xs mt-1 text-zinc-500 ${
              completed ? "hidden" : ""
            }`}
          >
            {getFormattedDate()}
          </span>
        </span>
        {description && (
          <span className="text-xs mt-1 text-zinc-400 dark:text-zinc-300">
            {description}
          </span>
        )}
      </div>
      <button
        className={`ml-4 border text-white px-3 py-1 cursor-pointer ${
          completed ? "hidden" : "block"
        }`}
        onClick={handleToggle}
        title="complete"
      >
        <FontAwesomeIcon icon={faCheck} />
      </button>
      <button
        className="ml-4 border text-white px-3 py-1 cursor-pointer"
        onClick={handleDelete}
        title="delete"
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
};

export default Note;
