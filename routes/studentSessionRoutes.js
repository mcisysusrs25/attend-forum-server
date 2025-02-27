const express = require("express");
const router = express.Router();
const { getSessionsByStudentID, markAttendance1 } = require("../controllers/studentSessionController");

router.get("/:studentID", getSessionsByStudentID);
router.post("/mark-attendance", markAttendance1);

module.exports = router;
