const express = require("express");
const {
    createAttendanceSession,
    addAttendanceEntry,
    updateSessionStatus,
    getSessionAttendance,
    getAllSessions,
    getSingleSession,
    deleteSession
} = require("../controllers/attendanceSessionController");

const router = express.Router();

// Session management
router.post("/add", createAttendanceSession);
router.get("/", getAllSessions);
router.get("/:id", getSingleSession);
router.put("/:sessionID/status", updateSessionStatus);
router.delete("/:id", deleteSession);

// Attendance recording
router.post("/:sessionID/attendance", addAttendanceEntry);
router.get("/:sessionID/attendance", getSessionAttendance);

module.exports = router;