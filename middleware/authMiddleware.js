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
      return res.status(401).json({ error: "Token Expired or Invalid" });
    }
    
    if (session.expiresAt < new Date()) {
      return res.status(401).json({ error: "Token Expired" });
    }
    
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    
    // Check userType in the decoded token
    const userType = decoded.type;
    
    if (userType === 'professor') {
      // Get professor by ID
      const professor = await Professor.findOne({ professorID: decoded.id });
      
      if (!professor) {
        return res.status(401).json({ error: "Professor not found" });
      }
      
      // Attach professor to request
      req.user = professor;
      req.userType = 'professor';
      
    } else if (userType === 'student') {
      // Get student by ID
      const student = await Student.findOne({ studentID: decoded.id });
      
      if (!student) {
        return res.status(401).json({ error: "Student not found" });
      }
      
      // Attach student to request
      req.user = student;
      req.userType = 'student';
      
    } else {
      return res.status(401).json({ error: "Invalid user type" });
    }
    
    next();
    
  } catch (error) {
    console.error("Authentication Error:", error);
    return res.status(401).json({ 
      error: "Authentication failed", 
      details: error.message 
    });
  }
};

module.exports = authenticate;