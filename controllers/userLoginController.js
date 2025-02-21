const jwt = require('jsonwebtoken');
const Professor = require("../models/Professor");
const Student = require("../models/Student");
const AuthSession = require("../models/AuthSession"); // Import AuthSession

// Helper function to generate JWT token
const generateToken = (user) => {
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
    const expiryTime = Math.floor(Date.now() / 1000) + (60 * 60); // 1 hour expiry in UNIX timestamp

    const token = jwt.sign(
        { id: user.professorID || user.studentID, email: user.email || user.studentEmail },
        process.env.JWT_SECRET,
        { expiresIn }
    );

    return { token, expiryTime };
};

// Login function for professors and students
const loginUser = async (req, res, next) => {
    try {
        const { email, userID, userType } = req.body; // Expecting email, userID, and userType

        // Validate input
        if (!email || !userID || !userType) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        let user;
        // Check user type and find the corresponding user
        if (userType === 'professor') {
            user = await Professor.findOne({ email });
            if (user && user.professorID === userID) {
                // Generate JWT token for the professor
                const { token, expiryTime } = generateToken(user);

                // Update or create a session in AuthSession collection
                await AuthSession.findOneAndUpdate(
                    { userId: user.professorID }, // Find by userId
                    {
                        token: token,
                        expiresAt: new Date(expiryTime * 1000) // Convert UNIX timestamp to Date
                    },
                    { new: true, upsert: true } // Create if it doesn't exist
                );

                // Set cookie (optional)
                res.cookie('sessionToken', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict',
                    maxAge: 3600 * 1000 // 1 hour
                });

                // Send response
                return res.status(200).json({
                    success: true,
                    data: {
                        user: {
                            id: user.professorID,
                            fullName: user.professorName,
                            email: user.email,
                            createdAt: user.createdAt
                        },
                        token
                    }
                });
            }
        } else if (userType === 'student') {
            user = await Student.findOne({ studentEmail: email });
            if (user && user.studentID === userID) {
                // Generate JWT token for the student
                const { token, expiryTime } = generateToken(user);

                // Update or create a session in AuthSession collection
                await AuthSession.findOneAndUpdate(
                    { userId: user.studentID }, // Find by userId
                    {
                        token: token,
                        expiresAt: new Date(expiryTime * 1000) // Convert UNIX timestamp to Date
                    },
                    { new: true, upsert: true } // Create if it doesn't exist
                );

                // Set cookie (optional)
                res.cookie('sessionToken', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict',
                    maxAge: 3600 * 1000 // 1 hour
                });

                // Send response
                return res.status(200).json({
                    success: true,
                    data: {
                        user: {
                            id: user.studentID,
                            fullName: `${user.firstName} ${user.lastName}`,
                            email: user.studentEmail,
                            createdAt: user.createdAt
                        },
                        token
                    }
                });
            }
        }

        // If no user found or ID does not match
        return res.status(401).json({ error: "Invalid email or user ID" });

    } catch (error) {
        next(error);
    }
};

module.exports = { loginUser };
