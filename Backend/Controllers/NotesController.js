const express = require('express')
const Notes = require('../Models/Notes')

const getNotes = async (req, res) => {
    try {
        const response = await Notes.find({ userId: req.user.id }).sort({ createdAt: -1 });
        if (!response) {
            return res.status(400).json({ message: 'Could not find any Notes' })
        }
        return res.status(200).json(response)

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const editNotes = async (req, res) => {
    try {
        const { id, title, content } = req.body
        const response = await Notes.findByIdAndUpdate(id, { title: title, content: content })
        if (!response) {
            return res.status(400).json({ message: 'Note not found' })
        }
        return res.json({ response });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await Notes.findByIdAndDelete(id);
        if (!response) {
            return res.status(400).json({ message: 'Could not delete Note' });
        }
        return res.status(200).json({ message: 'Note Deleted Sucessfully' })
    } catch (err) {

    }
}

module.exports = { getNotes, editNotes, deleteNote }