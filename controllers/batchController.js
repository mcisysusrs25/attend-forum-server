const Batch = require("../models/Batch");
const Student = require("../models/Student");

// ✅ Create a new batch
const createBatch = async (req, res) => {
    try {
        const { batchLabel, students } = req.body;

        if (!batchLabel || !Array.isArray(students)) {
            return res.status(400).json({ message: "Batch label and students array are required." });
        }

        // ✅ Validate student IDs
        const existingStudents = await Student.find({ studentID: { $in: students } });
        if (existingStudents.length !== students.length) {
            return res.status(400).json({ message: "Some student IDs do not exist." });
        }

        const newBatch = new Batch({ batchLabel, students });
        await newBatch.save();

        res.status(201).json({ message: "Batch created successfully", batch: newBatch });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Update a batch (Add/Remove students)
const updateBatch = async (req, res) => {
    try {
        const { batchId } = req.params;
        const { addStudents, removeStudents } = req.body;

        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ message: "Batch not found." });
        }

        if (addStudents && Array.isArray(addStudents)) {
            // ✅ Validate student IDs before adding
            const validStudents = await Student.find({ studentID: { $in: addStudents } });
            if (validStudents.length !== addStudents.length) {
                return res.status(400).json({ message: "Some student IDs do not exist." });
            }
            batch.students = [...new Set([...batch.students, ...addStudents])];
        }

        if (removeStudents && Array.isArray(removeStudents)) {
            batch.students = batch.students.filter(id => !removeStudents.includes(id));
        }

        await batch.save();
        res.status(200).json({ message: "Batch updated successfully", batch });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Delete a batch
const deleteBatch = async (req, res) => {
    try {
        const { batchId } = req.params;

        const batch = await Batch.findByIdAndDelete(batchId);
        if (!batch) {
            return res.status(404).json({ message: "Batch not found." });
        }

        res.status(200).json({ message: "Batch deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Get all batches
const getAllBatches = async (req, res) => {
    try {
        const batches = await Batch.find();
        res.status(200).json({ batches });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Get a single batch by ID
const getBatchById = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.batchId);
        if (!batch) {
            return res.status(404).json({ message: "Batch not found." });
        }
        res.status(200).json({ batch });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createBatch, updateBatch, deleteBatch, getAllBatches, getBatchById };
