const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const subjectRoutes = require("../routes/subjectRoutes");
const professorRoutes = require("../routes/professorRoutes");
const studentRoutes = require("../routes/studentRoutes");
const attendanceSessionRoutes = require("../routes/attendanceSessionRoutes");
const batchRoutes = require("../routes/batchRoutes");
const attendanceRoutes = require("../routes/attendanceRoutes");
const qrRoutes = require('../routes/qrRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
connectDB();

app.use("/api/subjects", subjectRoutes);
app.use("/api/professor", professorRoutes);
app.use("/api/students", studentRoutes);
// Use attendance session routes
app.use("/api/sessions", attendanceSessionRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use('/api/qr', qrRoutes);

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));