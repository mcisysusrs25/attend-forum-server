const jwt = require('jsonwebtoken');
const Professor = require("../models/Professor");
const Student = require("../models/Student");
const AuthSession = require("../models/AuthSession");

// Helper function to generate JWT token
const generateToken = (user, userType) => {
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
    const expiryTime = Math.floor(Date.now() / 1000) + (60 * 60 * 5 * 3); // 15 hours expiry in UNIX timestamp

    const token = jwt.sign(
        { 
            type: userType, 
            id: userType === 'professor' ? user.professorID : user.studentID, 
            email: userType === 'professor' ? user.email : user.studentEmail 
        },
        process.env.JWT_SECRET,
        { expiresIn }
    );
    return { token, expiryTime };
};

// Login function for professors and students
const loginUser = async (req, res, next) => {
    try {
        const { email, userID, userType } = req.body;

        // Validate input
        if (!email || !userID || !userType) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        let user;
        let userData = {};
        
        // Check user type and find the corresponding user
        if (userType === 'professor') {
            user = await Professor.findOne({ email });
            if (user && user.professorID === userID) {
                userData = {
                    id: user.professorID,
                    fullName: user.professorName,
                    email: user.email,
                    createdAt: user.createdAt,
                    userType: userType
                };
            }
        } else if (userType === 'student') {
            user = await Student.findOne({ studentEmail: email });
            if (user && user.studentID === userID) {
                userData = {
                    id: user.studentID,
                    fullName: `${user.firstName} ${user.lastName}`,
                    email: user.studentEmail,
                    createdAt: user.createdAt,
                    userType: userType
                };
            }
        }

        // If no valid user found
        if (!user || Object.keys(userData).length === 0) {
            return res.status(401).json({ error: "Invalid email or user ID" });
        }

        // Generate JWT token
        const { token, expiryTime } = generateToken(user, userType);

        // Update or create a session in AuthSession collection
        await AuthSession.findOneAndUpdate(
            { userId: userData.id },
            {
                token: token,
                expiresAt: new Date(expiryTime * 1000) // Convert UNIX timestamp to Date
            },
            { new: true, upsert: true }
        );

        // Set cookie with consistent expiration time
        const cookieMaxAge = 3600 * 1000 * 15; // 15 hours in milliseconds
        res.cookie('sessionToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: cookieMaxAge
        });

        // Send response
        return res.status(200).json({
            success: true,
            data: {
                user: userData,
                token
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        next(error);
    }
};

module.exports = { loginUser };