const mongoose = require('mongoose');

const mongooseUri = "mongodb+srv://abhisheksavaliya555:ELW4NgCLMTWt1JCT@cluster0.i7awtq3.mongodb.net/inotebook";

const connectToMongo = ()=>{
    mongoose.connect(mongooseUri); 
    console.log("Connected Successfully")
}

module.exports = connectToMongo;
