const Subject = require("../models/Subject");
const Professor = require("../models/Professor");

const createSubject = async (req, res, next) => {
  try {
    const { 
      subjectCode, 
      title, 
      description, 
      creditHours, 
      subjectTerm, 
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
      description,
      creditHours,
      subjectTerm,
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

module.exports = { createSubject };