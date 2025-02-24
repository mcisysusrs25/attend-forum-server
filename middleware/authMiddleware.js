const jwt = require('jsonwebtoken');
const Auth = require('../models/AuthSession');
const Professor = require('../models/Professor');
const Student = require('../models/Student');

const authenticate = async (req, res, next) => {
    try {
        let token;

        // Get token from headers
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        console.log("Received Token:", token);

        if (!token) {
            return res.status(401).json({ error: "Not authenticated - Token missing" });
        }

        // Verify token in AuthSession collection
        const session = await Auth.findOne({ token });
        console.log("Session Found:", session);

        if (!session) {
            return res.status(401).json({ error: "Invalid session - Token not found in AuthSession" });
        }

        if (session.expiresAt < new Date()) {
            return res.status(401).json({ error: "Expired session - Token is expired" });
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        // Get professor by ID or professorID based on your implementation
        const professor = await Professor.findOne({ professorID: decoded.id }); // Change to the correct field if necessary
        console.log("Professor Found:", professor);


        // Get professor by ID or professorID based on your implementation
        const student = await Student.findOne({ studentID: decoded.id }); // Change to the correct field if necessary
        console.log("Professor Found:", student);


        if (!professor && !student) {
            return res.status(401).json({ error: "Professor not found" });
        }

        // Attach professor to request
        req.professor = professor;
        next();

    } catch (error) {
        console.error("Authentication Error:", error);
        return res.status(401).json({ error: "Authentication failed", details: error.message });
    }
};

module.exports = authenticate;
