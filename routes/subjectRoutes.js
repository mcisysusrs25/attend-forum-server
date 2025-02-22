const express = require("express");
const { 
  createSubject, 
  getSubjects, 
  getSubjectsByProfessorID, 
  getSubjectById, 
  updateSubject, 
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
router.get("/:subjectID", getSubjectById);

// Update a subject by subjectID
router.put("update/:subjectID", updateSubject);

// Delete a subject by subjectID
router.delete("delete/:subjectID", deleteSubject);

module.exports = router;