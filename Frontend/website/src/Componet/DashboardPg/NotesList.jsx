import React, { useState } from "react";

const initialNotes = [
  {
    id: 1,
    title: "Note 1",
    date: "11/09/2025",
    content:
      "Create a short cinematic video using CapCut, applying transitions and filters.",
  },
  {
    id: 2,
    title: "Note 2",
    date: "16/09/2025",
    content:
      "Compile clips from a recent trip using CapCut's auto-caption and speed ramping.",
  },
  {
    id: 3,
    title: "Note 3",
    date: "28/09/2025",
    content:
      "Use CapCut to showcase a dramatic makeover or room renovation with split-screen effects.",
  },
];

const NotesList = () => {
  const [notes, setNotes] = useState(initialNotes);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: "", content: "" });

  // DELETE
  const handleDelete = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  // EDIT START
  const handleEdit = (note) => {
    setEditingId(note.id);
    setEditData({ title: note.title, content: note.content });
  };

  // SAVE EDIT
  const handleSave = (id) => {
    setNotes(
      notes.map((note) =>
        note.id === id
          ? { ...note, title: editData.title, content: editData.content }
          : note
      )
    );
    setEditingId(null);
  };

  return (
    <div className="p-6 md:p-10 w-full h-full">
      <h1 className="text-3xl md:text-4xl font-light text-white mb-8">
        All Saved Notes
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-black p-5 rounded-xl shadow-lg border border-[#1a1a1a] h-52 flex flex-col justify-between"
          >
            {editingId === note.id ? (
              <>
                {/* EDIT MODE */}
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  className="mb-2 bg-[#111] text-white p-2 rounded border border-gray-700"
                />

                <textarea
                  value={editData.content}
                  onChange={(e) =>
                    setEditData({ ...editData, content: e.target.value })
                  }
                  className="bg-[#111] text-white p-2 rounded border border-gray-700 resize-none h-20"
                />

                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 text-sm rounded bg-gray-600 text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave(note.id)}
                    className="px-3 py-1 text-sm rounded bg-teal-600 text-white"
                  >
                    Save
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* VIEW MODE */}
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-white text-lg font-medium">
                      {note.title}
                    </span>
                    <span className="text-gray-400 text-sm">{note.date}</span>
                  </div>

                  <p className="text-gray-300 text-sm line-clamp-3">
                    {note.content}
                  </p>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(note)}
                    className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesList;
