const Note = require("../models/Note");

exports.getAllNote = async (req,res)=>{
    try{
        const notes = await Note.find({user: req.user.id});
        res.json(notes);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Internal Server Error")
     }

}