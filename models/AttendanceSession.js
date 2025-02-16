const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const attendanceSessionSchema = new mongoose.Schema({
    sessionID: { type: String, required: true, unique: true, default: uuidv4 },
    sessionTitle: { type: String, required: true },
    sessionDescription: { type: String },
    sessionValidFrom: { type: Date, required: true },
    sessionValidTo: { type: Date, required: true },
    sessionStatus: { 
        type: String, 
        enum: ["active", "closed"],
        default: "active"
    },
    subjectCode: { type: String, required: true },
    createdBy: { type: String, required: true } // ProfessorID
});

// Index for better query performance
attendanceSessionSchema.index({ sessionValidFrom: 1, sessionValidTo: 1 });

module.exports = mongoose.model("AttendanceSession", attendanceSessionSchema);