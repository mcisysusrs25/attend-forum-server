const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
    batchID: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Auto-generated Batch ID
    batchLabel: { type: String, required: true }, // Batch Title
    students: [{ type: String, ref: "Student" }] // Store studentID as String
});

const Batch = mongoose.model("Batch", batchSchema);
module.exports = Batch;
