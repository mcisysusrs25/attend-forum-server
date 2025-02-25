const express = require("express");
const { 
  createSubject, 
  getSubjects, 
  getSubjectsByProfessorID, 
  updateSubjectByCode, 
  getSubjectByCode, 
  deleteSubject 
} = require("../controllers/subjectController");

const router = express.Router();

// Create a new subject
router.post("/add", createSubject);

// Get all subjects
router.get("/all", getSubjects);

// Get subjects by professorID
router.get("/getsubjects/:professorID", getSubjectsByProfessorID);

// Get a single subject by subjectID
router.get("/:subjectCode", getSubjectByCode);

// Update a subject by subjectID
router.put("/update/:subjectCode", updateSubjectByCode);

// Delete a subject by subjectID
router.delete("/delete/:subjectCode", deleteSubject);

module.exports = router;