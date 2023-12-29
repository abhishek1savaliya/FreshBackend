const { body, validationResult } = require('express-validator');
const Note = require("../models/Note");

exports.addNote = [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be at least 5 characters').isLength({ min: 5 })
    , async (req, res) => {

        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { title, description, tag } = req.body;
            const note = new Note({
                title, description, tag, user: req.user.id
            })
            const saveNote = await note.save();
            res.json(saveNote);

        }
        catch (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error")
        }
    }
]

exports.getAllNote = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error")
    }

}

exports.updateNote = async (req, res) => {
    const { title, description, tag } = req.body;

    try {

        const newNote = {};
        if (title) { newNote.title = title; }
        if (title) { newNote.description = description; }
        if (title) { newNote.tag = tag; }

        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error")
    }
}

exports.deleteNote =  async (req, res) => {
    try {

        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", note: note });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error")
    }
}


