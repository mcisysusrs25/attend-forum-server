// routes/studentRoutes.js
const express = require('express');
const { createStudent } = require('../controllers/registerStudentController'); // Adjust the path as necessary

const router = express.Router();

// Route for registering a new student
router.post('/register', createStudent);

module.exports = router;
