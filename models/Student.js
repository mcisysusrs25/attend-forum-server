// models/Student.js
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true }, // First name of the student
    lastName: { type: String, required: true }, // Last name of the student
    studentID: { type: String, required: true, unique: true, default: uuidv4 }, // Unique student ID
    studentEmail: { type: String, required: true, unique: true } // Unique student email
});

module.exports = mongoose.model("Student", studentSchema);