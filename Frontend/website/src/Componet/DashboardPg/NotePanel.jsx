import React, { useState } from 'react';
import { motion } from "framer-motion";
import { ChevronRightIcon, NotebookPen } from "lucide-react";
import axiosinstance from '../../Utilities/axiosIntance';
import { Toaster } from 'sonner';
import { toast } from 'sonner';

export default function NotesPanel({ func, isSideMenuOpen }) {

    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');

    const handleCreateNote = async () => {
        if (!noteTitle || !noteContent) {
            toast.error("Please fill all fields", { richColors: true, duration: 2500 });
            return;
        }
        const response = await axiosinstance.post('/notes/create-Note', {
            title: noteTitle,
            content: noteContent
        });
        if (response.data) {
            setNoteTitle('');
            setNoteContent('');
            toast.success("Note created and stored in Saved Notes section");
        }
    }

    return (
        <div className="relative w-full h-full flex flex-col overflow-x- bg-[#121212]">
            <motion.div
                onClick={func}
                animate={{ rotate: isSideMenuOpen ? 0 : 180 }}
                transition={{ duration: 0.5, ease: "easeInOut" }} className={`absolute -left-15 cursor-pointer top-5 w-fit h-fit p-2 border border-white rounded-full bg-black/80 hover:border-teal-300 hover:text-teal-300`}>
                <ChevronRightIcon size={30} className='text-white' />
            </motion.div>
            <div className="px-4 py-3 border-b border-gray-700 flex gap-2 items-center">
                <div>
                    <NotebookPen size={30} className="text-white mb-2 mt-2" />
                </div>
                <div className='flex flex-col'>
                    <h2 className="text-white font-medium">Session Notes</h2>
                    <p className="text-xs text-gray-400">
                        Saved in Your Notes Panel
                    </p>
                </div>
            </div>

            <div className='px-2 mt-2'>
                <input
                    type="text"
                    placeholder='Enter the Title'
                    className="w-full bg-black/40 text-white p-2 border border-white/30 rounded-xl outline-none"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                />
            </div>

            <textarea
                placeholder="Write key points, links, tasks..."
                className="w-[95%] h-full bg-black/40 text-white m-2 p-2 border border-white/30 rounded-xl outline-none mt-2"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
            />

            <button onClick={handleCreateNote} className="m-4 py-2 rounded bg-teal-600 hover:bg-teal-500 text-white">
                Save Notes
            </button>
        </div>
    );
};
