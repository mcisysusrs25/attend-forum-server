// professorRoutes.js
const express = require("express");
const { createProfessor } = require("../controllers/professorController");

const router = express.Router();

// Route to add a new professor
router.post("/add", createProfessor);

// Route to get all professors (placeholder, you can implement this later)
// router.get("/getall", getAllProfessors);

module.exports = router;