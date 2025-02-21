const express = require('express');
const { loginUser } = require('../controllers/userLoginController'); // Adjust the path as necessary

const router = express.Router();

// Route for registering a new student
router.post('/login', loginUser);

module.exports = router;
