const express = require("express");
const router = express.Router();
const {
    addAttendanceEntry,
    getAttendanceBySessionID,
    getStudentAttendance
} = require("../controllers/attendanceController");

// Add attendance entry
router.post("/add", addAttendanceEntry);

// Get all attendance records for a session
router.get("/getBySession/:sessionID", getAttendanceBySessionID);

// Get a specific student's attendance in a session
router.post("/getStudentAttendance", getStudentAttendance);

module.exports = router;
