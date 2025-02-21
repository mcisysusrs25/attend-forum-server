const jwt = require('jsonwebtoken');
const Professor = require("../models/Professor");
const AuthSession = require("../models/AuthSession"); // Make sure to import AuthSession

// Helper function to generate JWT token
const generateToken = (professor) => {
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
    const expiryTime = Math.floor(Date.now() / 1000) + (60 * 60); // 1 hour expiry in UNIX timestamp

    const token = jwt.sign(
        { id: professor.professorID, email: professor.email },
        process.env.JWT_SECRET,
        { expiresIn }
    );

    return { token, expiryTime };
};

const createProfessor = async (req, res, next) => {
    try {
        const { professorName, email, professorID } = req.body;

        // Validate input
        if (!professorName || !email || !professorID) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if email or professorID already exists
        const existingProfessor = await Professor.findOne({ 
            $or: [{ email }, { professorID }] 
        });
        if (existingProfessor) {
            return res.status(409).json({ error: "Email or ProfessorID already exists" });
        }

        // Create professor
        const newProfessor = await Professor.create({
            professorName,
            email,
            professorID
        });

        // Generate JWT token
        const { token, expiryTime } = generateToken(newProfessor);

        // Store session in AuthSession collection
        try {
            const session = await AuthSession.create({
                userId: newProfessor.professorID, // Use userId instead of professorID
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
                professor: {
                    professorID: newProfessor.professorID,
                    professorName: newProfessor.professorName,
                    email: newProfessor.email,
                    createdAt: newProfessor.createdAt,
                    userType: "professor",
                },
                token
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { createProfessor };
