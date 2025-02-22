// models/Batch.js
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const batchSchema = new mongoose.Schema({
    batchID: { type: String, required: true, unique: true, default: uuidv4 },
    batchLabel: { type: String, required: true },
    createdBy: { type: String, required: true }, // professorID
    students: [{ 
        type: String, // Store studentID as a string
        ref: "Student" // Reference the Student model
    }]
});

module.exports = mongoose.model("Batch", batchSchema);