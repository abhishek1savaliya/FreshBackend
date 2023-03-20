const mongoose = require('mongoose');

const mongooseUri = "mongodb+srv://Abhi:Pj8hC58xIWZvaaO7@cluster0.31pgkje.mongodb.net/inotebook";

const connectToMongo = ()=>{
    mongoose.connect(mongooseUri); 
    console.log("Connected Successfully")
}

module.exports = connectToMongo;
