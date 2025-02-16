// routes/studentRoutes.js
const express = require("express");
const { addStudent, addMultipleStudents } = require("../controllers/studentController");

const router = express.Router();

// Route to add a single student
router.post("/add", addStudent);

// Route to add multiple students
router.post("/add-multiple", addMultipleStudents);

module.exports = router;