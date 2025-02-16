// Professor.js
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const professorSchema = new mongoose.Schema({
    professorName: { type: String, required: true },
    professorID: { type: String, required: true, unique: true, default: uuidv4 }
});

module.exports = mongoose.model("Professor", professorSchema);