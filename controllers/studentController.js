// controllers/studentController.js
const Student = require("../models/Student");

// Add a single student
const addStudent = async (req, res, next) => {
    try {
        const { firstName, lastName, studentEmail, studentID } = req.body;

        // Check if the student email already exists
        const emailExists = await Student.findOne({ studentEmail });
        if (emailExists) {
            return res.status(400).json({ message: "Student email already exists. Please provide a unique email." });
        }

        // Create a new student
        const newStudent = new Student({ firstName, lastName, studentEmail, studentID });
        await newStudent.save();

        // Send success response
        res.status(201).json({ message: "Student added successfully", data: newStudent });
    } catch (error) {
        next(error);
    }
};


// Add multiple students
const addMultipleStudents = async (req, res, next) => {
    try {
        const students = req.body; // Array of student objects

        // Validate input
        if (!Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ message: "Please provide an array of students." });
        }

        // Check for duplicate studentIDs or emails in the input
        const studentIDs = students.map((student) => student.studentID);
        const studentEmails = students.map((student) => student.studentEmail);
        const duplicates = await Student.find({
            $or: [
                { studentID: { $in: studentIDs } },
                { studentEmail: { $in: studentEmails } }
            ]
        });

        if (duplicates.length > 0) {
            return res.status(400).json({ message: "Some student IDs or emails already exist in the database.", duplicates });
        }

        // Insert all students
        const insertedStudents = await Student.insertMany(students);

        // Send success response
        res.status(201).json({ message: "Students added successfully", data: insertedStudents });
    } catch (error) {
        next(error);
    }
};

module.exports = { addStudent, addMultipleStudents };