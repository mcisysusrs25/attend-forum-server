const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const batchSchema = new mongoose.Schema({
    batchID: { type: String, required: true, unique: true, default: uuidv4 },
    batchLabel: { type: String, required: true },
    createdBy: { type: String, required: true }, // professorID
    students: [{ type: String, ref: "Student" }] // Array of student IDs
});

module.exports = mongoose.model("Batch", batchSchema);
