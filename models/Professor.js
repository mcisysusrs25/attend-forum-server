const mongoose = require("mongoose");

const professorSchema = new mongoose.Schema({
    professorName: { 
        type: String, 
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    professorID: { 
        type: String, 
        required: true, 
        unique: true // Ensure professorID is unique
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Professor", professorSchema);