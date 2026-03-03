import axiosinstance from "../../Utilities/axiosIntance";
import React, { useEffect, useState } from "react";
import moment from "moment";
import Modal from "../../Utilities/Modal";

const NotesList = () => {
  const [fetchedNotes, setFetchedNotes] = useState([])
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: "", content: "" });
  const [selectedNote, setSelectedNote] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleFetchNotes = async (e) => {
    // e.preventDefault();
    const response = await axiosinstance.get('/Notes/fetch-Notes')
    if (response.data) {
      setFetchedNotes(response.data)
    } else {
      console.log('Error Fetching notes')
    }
  }

  const handleEditNote = async (note) => {
    const response = await axiosinstance.put('/Notes/edit-Note', { id: note._id, title: editData.title, content: editData.content })
    if (response) {
      handleFetchNotes();
      setEditingId(null)
    } else {
      console.log('Something went wrong in editing')
    }
  }

  useEffect(() => {
    handleFetchNotes()
  }, [])

  // DELETE
  const handleDeleteNote = async (note) => {
    const response = await axiosinstance.delete(`/Notes/delete-Notes/${note._id}`);
    if (!response) {
      console.log('Something went wrong in deleting Note');
    } else {
      setIsOpen(false);
      handleFetchNotes();
    }
  };

  const handleDeleteNoteModal = (note) => {
    setIsOpen(true);
    setSelectedNote(note);
  }

  // EDIT START
  const handleEdit = (note) => {
    setEditingId(note._id);
    setEditData({ title: note.title, content: note.content });
  };

  return (
    <div className="p-6 md:p-10 w-full h-full">
      <h1 className="text-3xl md:text-4xl font-light text-white mb-8">
        All Saved Notes
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 border gap-4">
        {fetchedNotes.map((note, index) => (
          <div
            key={index}
            className="bg-black p-5 rounded-xl shadow-lg border border-white/25 h-52 flex flex-col justify-between"
          >
            {editingId === note._id ? (
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
                    onClick={() => handleEditNote(note)}
                    className="px-3 py-1 text-sm rounded bg-teal-600 text-white cursor-pointer"
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
                    <span className="text-gray-400 text-sm">{moment(note.createdAt).format("DD MMM, YYYY")}</span>
                  </div>

                  <p className="text-gray-300 text-sm line-clamp-3">
                    {note.content}
                  </p>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(note)}
                    className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNoteModal(note)}
                    className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-500 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {isOpen && selectedNote && (
        <Modal
          title="Delete Note"
          isClose={() => setIsOpen(false)}
          className={'absolute w-full h-full'}
        >
          <div className="text-center w-full h-fit p-5 mx-3">{`Are you sure you want to delete "${selectedNote.title}"?`}</div>
          <div className="w-full h-fit flex items-center justify-center gap-5">
            <button onClick={() => setIsOpen(false)} className="w-fit h-fit px-7 cursor-pointer py-3 bg-white text-black rounded-xl">Cancel</button>
            <button onClick={() => handleDeleteNote(selectedNote)} className="w-fit h-fit px-7 cursor-pointer py-3 bg-red-400 text-white rounded-xl">Delete</button>
          </div>
        </Modal>
      )}    </div>
  );
};

export default NotesList;
