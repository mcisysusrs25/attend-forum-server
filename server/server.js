const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // Import the cors middleware
const cookieParser = require('cookie-parser');


const connectDB = require("../config/db");


const subjectRoutes = require("../routes/subjectRoutes");
const professorRoutes = require("../routes/professorRoutes");
const attendanceSessionRoutes = require("../routes/attendanceSessionRoutes");
const batchRoutes = require("../routes/batchRoutes");

const qrRoutes = require('../routes/qrRoutes');
const studentRoutes = require('../routes/studentRoutes'); 
const registerStudentsBySelfRoutes = require('../routes/registerStudents'); 
const loginUserRoutes = require('../routes/loginUserRoutes'); 
const authenticate = require('../middleware/authMiddleware');


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;


// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: false, // Disable credentials when using wildcard origin
}));

app.use(express.json());
app.use(cookieParser());
connectDB();

app.use("/api/professor", professorRoutes);

// Routes
app.use("/api/subjects", authenticate, subjectRoutes);

app.use("/api/sessions", authenticate,attendanceSessionRoutes);
app.use("/api/batches", authenticate,batchRoutes);
app.use('/api/qr', authenticate,qrRoutes);
app.use('/api/students/addbyProfessor', studentRoutes);
app.use('/api/students/addSelf', registerStudentsBySelfRoutes);

app.use('/api/auth/', loginUserRoutes);

// Test route
app.get("/test/hello", (req, res) => {
  res.send("hello");
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));