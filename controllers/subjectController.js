const Subject = require("../models/Subject");
const Professor = require("../models/Professor");

// 1. Create a new subject
const createSubject = async (req, res, next) => {
  try {
    const { 
      subjectCode, 
      title, 
      professorID 
    } = req.body;

    // Check if the professorID exists in the Professor collection
    const professorExists = await Professor.findOne({ professorID });
    if (!professorExists) {
      return res.status(400).json({ 
        message: "Professor ID does not exist. Please provide a valid professorID." 
      });
    }

    // Check if the subjectCode already exists in the Subject collection
    const subjectCodeExists = await Subject.findOne({ subjectCode });
    if (subjectCodeExists) {
      return res.status(400).json({ 
        message: "Subject code already exists. Please provide a unique subject code." 
      });
    }

    // Create the new subject
    const newSubject = new Subject({
      subjectCode,
      title,
      professorID
    });

    const savedSubject = await newSubject.save();

    res.status(201).json({ 
      message: "Subject created successfully", 
      data: savedSubject 
    });

  } catch (error) {
    // Log the error for debugging
    console.error('Error creating subject:', error);

    if (error.code === 11000) {
      // Check which field caused the duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `A subject with this ${field} already exists. Please provide a unique ${field}.`
      });
    }

    // Handle other types of errors
    return res.status(500).json({ 
      message: "An error occurred while creating the subject.",
      error: error.message
    });
  }
};

// 2. Get all subjects
const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find();

    if (subjects.length === 0) {
      return res.status(404).json({ 
        message: "No subjects found." 
      });
    }

    res.status(200).json({ 
      message: "Subjects fetched successfully", 
      data: subjects 
    });

  } catch (error) {
    console.error('Error fetching subjects:', error);
    return res.status(500).json({ 
      message: "An error occurred while fetching subjects.",
      error: error.message
    });
  }
};

// 3. Get subjects by professorID
const getSubjectsByProfessorID = async (req, res, next) => {
  try {
    const { professorID } = req.params;

    // Check if the professorID exists in the Professor collection
    const professorExists = await Professor.findOne({ professorID });
    if (!professorExists) {
      return res.status(400).json({ 
        message: "Professor ID does not exist. Please provide a valid professorID." 
      });
    }

    // Fetch all subjects associated with the professorID
    const subjects = await Subject.find({ professorID });

    if (subjects.length === 0) {
      return res.status(404).json({ 
        message: "No subjects found for the provided professorID." 
      });
    }

    res.status(200).json({ 
      message: "Subjects fetched successfully", 
      data: subjects 
    });

  } catch (error) {
    console.error('Error fetching subjects by professorID:', error);
    return res.status(500).json({ 
      message: "An error occurred while fetching subjects by professorID.",
      error: error.message
    });
  }
};

const updateSubjectByCode = async (req, res, next) => {
  try {
    const { subjectCode } = req.params;
    const updateData = req.body;

    // Check if the subject exists
    const subjectExists = await Subject.findOne({ subjectCode });
    if (!subjectExists) {
      return res.status(404).json({ message: "Subject not found." });
    }

    // Ensure unique subjectCode if being updated
    if (updateData.subjectCode && updateData.subjectCode !== subjectExists.subjectCode) {
      const existingSubject = await Subject.findOne({ subjectCode: updateData.subjectCode });
      if (existingSubject) {
        return res.status(400).json({ message: "Subject code already exists. Please provide a unique subject code." });
      }
    }

    // Update the subject
    const updatedSubject = await Subject.findOneAndUpdate({ subjectCode }, updateData, { new: true });

    res.status(200).json({ message: "Subject updated successfully", data: updatedSubject });

  } catch (error) {
    console.error('Error updating subject:', error);
    return res.status(500).json({ message: "An error occurred while updating the subject.", error: error.message });
  }
};

const deleteSubject = async (req, res, next) => {
  try {
    const { subjectCode } = req.params;

    console.log("Got this from the client ->", subjectCode);

    // Check if the subject exists
    const subjectExists = await Subject.findOne({ subjectCode });
    if (!subjectExists) {
      return res.status(404).json({
        message: "Subject not found."
      });
    }

    // Delete the subject using subjectCode instead of _id
    await Subject.deleteOne({ subjectCode });

    res.status(200).json({
      message: "Subject deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting subject:", error);
    return res.status(500).json({
      message: "An error occurred while deleting the subject.",
      error: error.message
    });
  }
};
const getSubjectByCode = async (req, res, next) => {
  try {
    const { subjectCode } = req.params;

    const subject = await Subject.findOne({ subjectCode });

    if (!subject) {
      return res.status(404).json({ 
        message: "Subject not found." 
      });
    }

    res.status(200).json({ 
      message: "Subject fetched successfully", 
      data: subject 
    });

  } catch (error) {
    console.error('Error fetching subject by subjectCode:', error);
    return res.status(500).json({ 
      message: "An error occurred while fetching the subject.",
      error: error.message
    });
  }
};

// Export all functions
module.exports = { 
  createSubject, 
  getSubjects, 
  getSubjectsByProfessorID, 
  updateSubjectByCode, 
  getSubjectByCode, 
  deleteSubject 
};