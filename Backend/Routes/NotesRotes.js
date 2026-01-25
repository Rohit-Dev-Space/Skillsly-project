const express = require('express');
const { getNotes, editNotes, deleteNote } = require('../Controllers/NotesController');
const authMiddleWare = require('../MiddleWare/AuthMiddleware');
const router = express.Router();

router.get('/fetch-Notes', authMiddleWare, getNotes);
router.put('/edit-Note', authMiddleWare, editNotes)
router.delete('/delete-Notes/:id', authMiddleWare, deleteNote)

module.exports = router;