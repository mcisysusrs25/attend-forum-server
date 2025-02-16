const mongoose = require("mongoose");

const attendanceEntrySchema = new mongoose.Schema({
    sessionID: { type: String, required: true },
    studentID: { type: String, required: true },
    attendanceStatus: { type: Boolean, default: false },
    geolocation: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    timestamp: { type: Date, default: Date.now }
});

// Compound index to prevent duplicate entries for the same session+student
attendanceEntrySchema.index({ sessionID: 1, studentID: 1 }, { unique: true });

module.exports = mongoose.model("AttendanceEntry", attendanceEntrySchema);