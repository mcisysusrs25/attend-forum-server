const Batch = require("../models/Batch");
const Professor = require("../models/Professor");
const Student = require("../models/Student");
const AttendanceSession = require("../models/AttendanceSession");
const AttendanceEntry = require("../models/AttendanceEntry");


// Create Batch
const createBatch = async (req, res, next) => {
    try {
        const { batchLabel, createdBy, students } = req.body;

        // Check if the professor exists
        const professorExists = await Professor.findOne({ professorID: createdBy });
        if (!professorExists) {
            return res.status(404).json({ message: "Professor not found" });
        }

        // Validate that all student IDs exist
        const studentRecords = await Student.find({ studentID: { $in: students } });
        if (studentRecords.length !== students.length) {
            return res.status(400).json({ message: "Some student IDs are invalid" });
        }

        const newBatch = new Batch({ batchLabel, createdBy, students });
        await newBatch.save();

        res.status(201).json({ message: "Batch created successfully", data: newBatch });
    } catch (error) {
        next(error);
    }
};

const getAllBatchesByProfessorId = async (req, res, next) => {
    try {
        const { professorID } = req.body; // Assuming the professorID is sent in the request body
        
        // Check if the professor exists
        const professorExists = await Professor.findOne({ professorID });
        if (!professorExists) {
            return res.status(404).json({ message: "Professor not found" });
        }

        // Fetch all batches for this professor
        const batches = await Batch.find({ createdBy: professorID });
        if (batches.length === 0) {
            return res.status(404).json({ message: "No batches found for this professor" });
        }

        res.status(200).json({ data: batches });
    } catch (error) {
        next(error);
    }
};

// Get Batch Details by ID
const getBatchDetails = async (req, res, next) => {
    try {
        const batch = await Batch.findOne({ batchID: req.params.id }).populate("students");
        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }
        res.status(200).json({ data: batch });
    } catch (error) {
        next(error);
    }
};

// Update Batch (Add/Remove Students)
const updateBatch = async (req, res, next) => {
    try {
        const { batchID, studentsToAdd, studentsToRemove } = req.body;

        const batch = await Batch.findOne({ batchID });
        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }

        // Remove students if specified
        if (studentsToRemove) {
            batch.students = batch.students.filter(studentID => !studentsToRemove.includes(studentID));
        }

        // Add new students if specified
        if (studentsToAdd) {
            const studentRecords = await Student.find({ studentID: { $in: studentsToAdd } });
            if (studentRecords.length !== studentsToAdd.length) {
                return res.status(400).json({ message: "Some student IDs are invalid" });
            }
            batch.students.push(...studentsToAdd);
        }

        await batch.save();
        res.status(200).json({ message: "Batch updated successfully", data: batch });
    } catch (error) {
        next(error);
    }
};

// Delete Batch
const deleteBatch = async (req, res, next) => {
    try {
        const batch = await Batch.findOneAndDelete({ batchID: req.params.id });
        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }
        res.status(200).json({ message: "Batch deleted successfully" });
    } catch (error) {
        next(error);
    }
};


const assignBatchesToSession = async (req, res, next) => {
    try {
        const { sessionID, batchIDs } = req.body;

        // Check if the session exists
        const session = await AttendanceSession.findOne({ sessionID });
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        for (const batchID of batchIDs) {
            // Fetch the batch by batchID without using populate
            const batch = await Batch.findOne({ batchID });
            if (!batch) {
                return res.status(404).json({ message: `Batch with ID ${batchID} not found` });
            }

            // Iterate over studentIDs and fetch individual students
            for (const studentID of batch.students) {
                const student = await Student.findOne({ studentID });
                if (!student) {
                    return res.status(404).json({ message: `Student with ID ${studentID} not found` });
                }

                // Create attendance entry for the student
                const attendanceEntry = new AttendanceEntry({
                    sessionID,
                    studentID,  // Directly using the studentID
                    attendanceStatus: false, // Default to absent
                    geolocation: {
                        lat: null, // Set to null or you can leave it undefined if no data
                        lng: null  // Set to null or you can leave it undefined if no data
                    }
                });

                // Save the attendance entry and handle any duplicate entry errors
                try {
                    await attendanceEntry.save();
                } catch (error) {
                    if (error.code === 11000) {
                        // Handle duplicate entry error based on the unique index
                        console.error(`Duplicate attendance entry found for session ${sessionID} and student ${studentID}`);
                    } else {
                        throw error;
                    }
                }
            }
        }

        res.status(201).json({
            message: "Batches assigned to session successfully"
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    assignBatchesToSession,
    createBatch,
    getAllBatchesByProfessorId,
    getBatchDetails,
    updateBatch,
    deleteBatch
};
