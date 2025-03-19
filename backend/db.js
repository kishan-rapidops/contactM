const mongoose = require('mongoose');
// const mongoURI = 'mongodb://localhost:27017/iNotebook'
const mongoURI='mongodb+srv://savitasingh5477:kishan@cluster0.nvwmrzr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


const connectToMongo = async () => {
    try {
        mongoose.connect(mongoURI)
        console.log('Mongo connected')
    }
    catch (error) {
        console.log(error)
        process.exit()
    }
}

module.exports = connectToMongo;