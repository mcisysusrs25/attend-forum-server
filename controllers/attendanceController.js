const AttendanceSession = require("../models/AttendanceSession");
const AttendanceEntry = require("../models/AttendanceEntry");

// Add attendance entry
const addAttendanceEntry = async (req, res) => {
    try {
        const { sessionID, studentID, attendanceStatus, geolocation } = req.body;

        // Check if the session exists
        const session = await AttendanceSession.findOne({ sessionID });

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        // Validate geolocation
        if (!geolocation || typeof geolocation.lat !== "number" || typeof geolocation.lng !== "number") {
            return res.status(400).json({ message: "Invalid geolocation data" });
        }

        // Create attendance entry
        const attendanceEntry = new AttendanceEntry({
            sessionID,
            studentID,
            attendanceStatus,
            geolocation
        });

        await attendanceEntry.save();
        res.status(201).json({ message: "Attendance recorded successfully", data: attendanceEntry });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Attendance already recorded for this student in this session" });
        }
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get all attendance entries for a session
const getAttendanceBySessionID = async (req, res) => {
    try {
        const { sessionID } = req.params;
        const attendanceEntries = await AttendanceEntry.find({ sessionID });

        if (!attendanceEntries.length) {
            return res.status(404).json({ message: "No attendance records found for this session" });
        }

        res.status(200).json({ data: attendanceEntries });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const getStudentAttendance = async (req, res) => {
    try {
        const { studentID } = req.body;

        // Fetch attendance records for the student
        const attendanceRecords = await AttendanceEntry.find({ studentID });

        if (!attendanceRecords.length) {
            return res.status(404).json({ message: "No attendance records found for this student" });
        }

        res.status(200).json({ data: attendanceRecords });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


module.exports = { addAttendanceEntry, getAttendanceBySessionID, getStudentAttendance };
