const express = require("express");
const {
    updateAttendanceSession,
    updateAttendanceStatus,
    createAttendanceSession,
    addAttendanceEntry,
    getSessionAttendance,
    getAllSessionsByProfessor,
    getSingleSession,
    deleteSession
} = require("../controllers/attendanceSessionController");

const router = express.Router();

// Session management
router.post("/add", createAttendanceSession);
router.post("/getSessionsbyProfessor", getAllSessionsByProfessor);
router.get("/gsd/:sessionID", getSingleSession);

router.post('/updateStatus/:sessionID', updateAttendanceStatus);
router.post('/updateSession/:sessionID', updateAttendanceSession);

router.delete("/delete/:id", deleteSession); // deletion is not possible. 

// Attendance recording
router.post("/:sessionID/attendance", addAttendanceEntry);
router.get("/:sessionID/attendance", getSessionAttendance);

router.post("/attendence/add", addAttendanceEntry);

module.exports = router;