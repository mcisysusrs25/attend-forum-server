const express = require("express");
const router = express.Router();
const { getSessionsByStudentID, markAttendance } = require("../controllers/studentSessionController");

router.get("/:studentID", getSessionsByStudentID);
router.post("/mark-attendance", markAttendance);

module.exports = router;
