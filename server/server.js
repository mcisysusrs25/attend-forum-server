const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
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
const classConfigurationRoutes = require("../routes/classConfigurationRoutes");
const studentSessionRoutes = require("../routes/studentSessionRoutes");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000; // Changed to 5000 to match your frontend calls

const allowedOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500', // Add this to explicitly allow requests from your frontend
  'http://localhost:3000',
  'https://mcisysusrs25.github.io/',
  'https://attend-forum-server-dev-1-0.onrender.com',
  'https://attend-forum-ui-react-next.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, 
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add this middleware to explicitly allow headers for preflight requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});


app.use(express.json());
app.use(cookieParser());

connectDB();

// Routes
app.use("/api/professor", professorRoutes);
app.use("/api/subjects", authenticate, subjectRoutes);
app.use("/api/sessions", authenticate, attendanceSessionRoutes);
app.use("/api/batches", authenticate, batchRoutes);
app.use('/api/qr', authenticate, qrRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/students/addSelf', registerStudentsBySelfRoutes);
app.use('/api/auth', loginUserRoutes); 
app.use("/api/class-configurations",authenticate, classConfigurationRoutes);
app.use("/api/student/sessions", authenticate, studentSessionRoutes);


// Test route
app.get("/test/hello", (req, res) => {
  res.send("hello");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));