// professorController.js
const Professor = require("../models/Professor");

const createProfessor = async (req, res, next) => {
    try {
        const { professorName, professorID } = req.body;

        // Create a new professor instance
        const newProfessor = new Professor({ professorName, professorID });

        // Save the new professor to the database
        await newProfessor.save();

        // Send a success response
        res.status(201).json({ message: "Professor created successfully", data: newProfessor });
    } catch (error) {
        // Pass any errors to the error-handling middleware
        next(error);
    }
};

module.exports = { createProfessor };