import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import Note from "./Note";
import CreateNote from "./CreateNotes";

const NoteContainer = () => {
  const [notes, setNotes] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axiosInstance.get("/notes");
        setNotes(res.data);
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleAddNote = () => {
    setShowInput(true);
  };

  const handleSaveNote = (note) => {
    if (note.title.trim()) {
      setNotes([...notes, { ...note, completed: false }]);
      setShowInput(false);
    }
  };

  // const handleToggle = (idx) => {
  //   setNotes(
  //     notes.map((q, i) => (i === idx ? { ...q, completed: !q.completed } : q))
  //   );
  // };
  const handleToggle = (updatedNote) => {
    setNotes((prev) =>
      prev.map((q) => (q._id === updatedNote._id ? updatedNote : q))
    );
  };

  // const handleDelete = (idx) => {
  //   setNotes(notes.filter((_, i) => i !== idx));
  // };
  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((q) => q._id !== id));
  };

  // Sort notes: pending first, completed last
  const sortedNotes = [...notes].sort((a, b) => a.completed - b.completed);

  return (
    <div className="h-[35rem] w-[35rem] border p-1 font-mono">
      <div className="border h-full">
        <div className="border-b flex justify-between items-center p-4 bg-zinc-800">
          <h1 className="text-2xl font-semibold">Active Notes</h1>
          <button
            className="border p-2 cursor-pointer"
            onClick={handleAddNote}
          >
            + New Note
          </button>
        </div>
        <div
          className="p-4 overflow-y-auto h-[calc(100%-75px)] scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900"
          style={{
            scrollbarColor: "#52525b #18181b",
            scrollbarWidth: "thin",
          }}
        >
          <CreateNote
            showInput={showInput}
            setShowInput={setShowInput}
            onSave={handleSaveNote}
          />

          {loading ? (
            <div className="text-center text-[#aaa]">Loading notes...</div>
          ) : sortedNotes.length === 0 ? (
            <div className="text-center text-[#aaa]">
              No active notes yet. Start by creating a new note!
            </div>
          ) : (
            <ul className="space-y-3">
              {sortedNotes.map((note) => (
                <li key={note._id}>
                  <Note
                    id={note._id}
                    text={note.title}
                    description={note.description}
                    completed={note.completed}
                    createdAt={note.createdAt}
                    // onToggle={() => handleToggle(idx)}
                    onToggle={handleToggle}
                    // onDelete={() => handleDelete(idx)}
                    onDelete={() => handleDelete(note._id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteContainer;
