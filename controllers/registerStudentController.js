const jwt = require('jsonwebtoken');
const Student = require("../models/Student");
const AuthSession = require("../models/AuthSession"); // Import AuthSession if you want to use sessions

// Helper function to generate JWT token for students
const generateStudentToken = (student) => {
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
    const expiryTime = Math.floor(Date.now() / 1000) + (60 * 60); // 1 hour expiry in UNIX timestamp

    const token = jwt.sign(
        { id: student.studentID, email: student.studentEmail },
        process.env.JWT_SECRET,
        { expiresIn }
    );

    return { token, expiryTime };
};

// Create Student
const createStudent = async (req, res, next) => {
    try {
        const { firstName, lastName, studentEmail, studentID } = req.body;

        // Validate input
        if (!firstName || !lastName || !studentEmail || !studentID) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if email or studentID already exists
        const existingStudent = await Student.findOne({ 
            $or: [{ studentEmail }, { studentID }] 
        });
        if (existingStudent) {
            return res.status(409).json({ error: "Student email or ID already exists" });
        }

        // Create student
        const newStudent = await Student.create({
            firstName,
            lastName,
            studentID,  // Use provided studentID from the request body
            studentEmail
        });

        // Generate JWT token for the student
        const { token, expiryTime } = generateStudentToken(newStudent);

        // Store session in AuthSession collection
        try {
            const session = await AuthSession.create({
                userId: newStudent.studentID, // Use userId instead of studentID
                token: token,
                expiresAt: new Date(expiryTime * 1000) // Convert UNIX timestamp to Date
            });
            console.log("AuthSession created successfully:", session);
        } catch (sessionError) {
            console.error("Error creating AuthSession:", sessionError);
        }

        // Set cookie (optional)
        res.cookie('sessionToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600 * 1000 // 1 hour
        });

        // Send response
        res.status(201).json({
            success: true,
            data: {
                student: {
                    studentID: newStudent.studentID,
                    fullName: `${newStudent.firstName} ${newStudent.lastName}`,
                    studentEmail: newStudent.studentEmail,
                    createdAt: newStudent.createdAt
                },
                token
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { createStudent };
