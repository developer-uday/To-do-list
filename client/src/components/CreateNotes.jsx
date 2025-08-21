import React, { useState, useRef, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const CreateNote = ({ showInput, setShowInput, onSave }) => {
  const [input, setInput] = useState("");
  const [description, setDescription] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const handleSaveNote = async () => {
    if (input.trim().length < 3 || input.trim().length > 15) {
      toast.error("Title must be 3-15 characters.");
      return;
    }
    if (input.trim()) {
      try {
        const res = await axiosInstance.post("/notes/create-note", {
          title: input,
          description,
        });

        // Ever created notes count
        await axiosInstance.patch("/user/count-notes-created");

        onSave(res.data);
        toast.success("Note created successfully!");
        setInput("");
        setDescription("");
        setShowInput(false);
      } catch (err) {
        toast.error(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "Error saving note. Please try again."
        );
        console.error("Error saving note:", err);
      }
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveNote();
    }
  };

  return (
    <>
      {showInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/95 font-mono">
          <div className="w-full max-w-md border p-1">
            <div className="border shadow-lg p-6 w-full flex flex-col gap-4">
              <h2 className="text-xl font-bold mb-2">Create New Note</h2>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                ref={inputRef}
                placeholder="Note title..."
                className="border focus:outline-none px-2 py-1"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                className="border focus:outline-none px-2 py-1 resize-none"
                rows={3}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  className="border px-4 py-1 cursor-pointer"
                  onClick={() => {
                    setShowInput(false);
                    setInput("");
                    setDescription("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="border px-4 py-1 cursor-pointer font-semibold"
                  onClick={handleSaveNote}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateNote;
