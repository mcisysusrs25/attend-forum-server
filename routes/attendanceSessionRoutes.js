const express = require("express");
const {
    getAttendanceSessionsByStudent,
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
router.get("/getSessionsbyProfessor/:professorID", getAllSessionsByProfessor);

router.get("/gsd/:sessionID", getSingleSession);
router.get("/getByStudentId/:studentID", getAttendanceSessionsByStudent);

router.post('/updateStatus/:sessionID', updateAttendanceStatus);
router.post('/updateSession/:sessionID', updateAttendanceSession);

router.delete("/delete/:id", deleteSession); // deletion is not possible. 

// Attendance recording
router.post("/:sessionID/attendance", addAttendanceEntry);
router.get("/:sessionID/attendance", getSessionAttendance);

router.post("/attendence/add", addAttendanceEntry);

module.exports = router;