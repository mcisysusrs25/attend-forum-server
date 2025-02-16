const AttendanceSession = require("../models/AttendanceSession");
const AttendanceEntry = require("../models/AttendanceEntry");
const Subject = require("../models/Subject");
const Professor = require("../models/Professor");
const Student = require("../models/Student");

// Create new attendance session
const createAttendanceSession = async (req, res, next) => {
    try {
        const { sessionTitle, sessionDescription, subjectCode, createdBy, sessionValidFrom, sessionValidTo } = req.body;

        // Validate time range
        if (new Date(sessionValidFrom) >= new Date(sessionValidTo)) {
            return res.status(400).json({ message: "Invalid time range - end time must be after start time" });
        }

        // Validate subject exists
        const subjectExists = await Subject.findOne({ subjectCode });
        if (!subjectExists) {
            return res.status(400).json({ message: "Invalid subject code" });
        }

        // Validate professor exists
        const professorExists = await Professor.findOne({ professorID: createdBy });
        if (!professorExists) {
            return res.status(400).json({ message: "Invalid professor ID" });
        }

        // Create new session
        const newSession = new AttendanceSession({
            sessionTitle,
            sessionDescription,
            subjectCode,
            createdBy,
            sessionValidFrom,
            sessionValidTo
        });

        await newSession.save();
        res.status(201).json({ message: "Attendance session created successfully", data: newSession });

    } catch (error) {
        next(error);
    }
};

// Add student attendance to session
const addAttendanceEntry = async (req, res, next) => {
    try {
        const { sessionID } = req.params;
        const { studentID, lat, lng } = req.body;

        // Validate session exists
        const session = await AttendanceSession.findOne({ sessionID });
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        // Validate student exists
        const student = await Student.findOne({ studentID });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Check if attendance already exists
        const existingEntry = await AttendanceEntry.findOne({ sessionID, studentID });
        if (existingEntry) {
            return res.status(400).json({ message: "Attendance already recorded for this student" });
        }

        // Create new attendance entry
        const newEntry = new AttendanceEntry({
            sessionID,
            studentID,
            attendanceStatus: true,
            geolocation: { lat, lng }
        });

        await newEntry.save();
        res.status(201).json({ message: "Attendance recorded successfully", data: newEntry });

    } catch (error) {
        next(error);
    }
};

// Update session status
const updateSessionStatus = async (req, res, next) => {
    try {
        const { sessionID } = req.params;
        const { sessionStatus } = req.body;

        const session = await AttendanceSession.findOneAndUpdate(
            { sessionID },
            { sessionStatus },
            { new: true }
        );

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        res.status(200).json({ message: "Session status updated", data: session });
    } catch (error) {
        next(error);
    }
};

// Get session attendance
const getSessionAttendance = async (req, res, next) => {
    try {
        const { sessionID } = req.params;
        
        const attendance = await AttendanceEntry.find({ sessionID })
            .populate('student', 'firstName lastName studentID -_id');

        res.status(200).json({ data: attendance });
    } catch (error) {
        next(error);
    }
};

// Get all sessions
const getAllSessions = async (req, res, next) => {
    try {
        const sessions = await AttendanceSession.find({});
        res.status(200).json({ data: sessions });
    } catch (error) {
        next(error);
    }
};

// Get single session
const getSingleSession = async (req, res, next) => {
    try {
        const session = await AttendanceSession.findOne({ sessionID: req.params.id });
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        res.status(200).json({ data: session });
    } catch (error) {
        next(error);
    }
};

// Delete session
const deleteSession = async (req, res, next) => {
    try {
        const session = await AttendanceSession.findOneAndDelete({ sessionID: req.params.id });
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        res.status(200).json({ message: "Session deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createAttendanceSession,
    addAttendanceEntry,
    updateSessionStatus,
    getSessionAttendance,
    getAllSessions,
    getSingleSession,
    deleteSession
};