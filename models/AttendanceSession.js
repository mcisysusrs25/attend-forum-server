// models/AttendanceSession.js
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
        enum: ["active", "completed", "new"],
        default: "new"
    },
    subjectCode: { type: String, required: true },
    createdBy: { type: String, required: true }, // ProfessorID
    batchID: { type: String, required: true, ref: "Batch" }, 
    classConfigId: { type: String, required: true, ref: "ClassConfiguration" }, 
    sessionCreatedDateTime: { type: Date, default: Date.now }, // Session creation time
    students: [{
        studentID: { type: String, required: true, ref: "Student" }, // Reference to Student
        attendanceStatus: { type: String, enum: ["Present", "Absent"], default: "Absent" }
    }]
});


module.exports = mongoose.model("AttendanceSession", attendanceSessionSchema);