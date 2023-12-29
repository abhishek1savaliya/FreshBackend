const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const { getAllNote, updateNote, addNote, deleteNote } = require('../controller.js/note.controller');

router.get('/fetchallnotes', fetchuser, getAllNote)

router.post('/addnote', fetchuser, addNote);

router.put('/updatenote/:id', fetchuser, updateNote)

router.delete('/deletenote/:id', fetchuser, deleteNote)

module.exports = router;