const AttendanceSession = require("../models/AttendanceSession");
const Subject = require("../models/Subject");
const Professor = require("../models/Professor");
const Student = require("../models/Student");
const Batch = require("../models/Batch");



const createAttendanceSession = async (req, res, next) => {
    try {
        const { sessionTitle, sessionDescription, subjectCode, createdBy, sessionValidFrom, sessionValidTo, batchID } = req.body;

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

        // Validate batch exists
        const batch = await Batch.findOne({ batchID });
        if (!batch) {
            return res.status(400).json({ message: "Invalid batch ID" });
        }

        // Fetch students using studentID
        const students = await Student.find({ studentID: { $in: batch.students } });
        if (students.length === 0) {
            return res.status(400).json({ message: "No students found in the specified batch" });
        }

        // Prepare students array with default attendance status
        const sessionStudents = students.map(student => ({
            studentID: student.studentID, // Use student.studentID
            attendanceStatus: "Absent"
        }));

        // Create new session
        const newSession = new AttendanceSession({
            sessionTitle,
            sessionDescription,
            subjectCode,
            createdBy,
            sessionValidFrom,
            sessionValidTo,
            batchID,
            students: sessionStudents
        });

        await newSession.save();
        res.status(201).json({ message: "Attendance session created successfully", data: newSession });

    } catch (error) {
        next(error);
    }
};

const updateAttendanceSession = async (req, res, next) => {
    try {
        const { sessionID } = req.params; // Extract sessionID from URL params
        const { sessionTitle, sessionDescription, sessionValidFrom, sessionValidTo, subjectCode, batchID } = req.body;

        // Validate time range
        if (new Date(sessionValidFrom) >= new Date(sessionValidTo)) {
            return res.status(400).json({ message: "Invalid time range - end time must be after start time" });
        }

        // Validate subject exists
        const subjectExists = await Subject.findOne({ subjectCode });
        if (!subjectExists) {
            return res.status(400).json({ message: "Invalid subject code" });
        }

        // Fetch the existing session
        const existingSession = await AttendanceSession.findOne({ sessionID });
        if (!existingSession) {
            return res.status(404).json({ message: "Session not found" });
        }

        // Check if batchID is being updated
        if (batchID && batchID !== existingSession.batchID) {
            // Validate the new batch exists
            const newBatch = await Batch.findOne({ batchID });
            if (!newBatch) {
                return res.status(400).json({ message: "Invalid batch ID" });
            }

            // Fetch students for the new batch
            const students = await Student.find({ studentID: { $in: newBatch.students } });
            if (students.length === 0) {
                return res.status(400).json({ message: "No students found in the specified batch" });
            }

            // Prepare students array with default attendance status
            const sessionStudents = students.map(student => ({
                studentID: student.studentID, // Use student.studentID
                attendanceStatus: "Absent"
            }));

            // Update the session with the new batch and students
            existingSession.batchID = batchID;
            existingSession.students = sessionStudents;
        }

        // Update other fields
        existingSession.sessionTitle = sessionTitle || existingSession.sessionTitle;
        existingSession.sessionDescription = sessionDescription || existingSession.sessionDescription;
        existingSession.sessionValidFrom = sessionValidFrom || existingSession.sessionValidFrom;
        existingSession.sessionValidTo = sessionValidTo || existingSession.sessionValidTo;
        existingSession.subjectCode = subjectCode || existingSession.subjectCode;

        // Save the updated session
        await existingSession.save();

        res.status(200).json({ message: "Attendance session updated successfully", data: existingSession });

    } catch (error) {
        next(error);
    }
};

const addAttendanceEntry = async (req, res, next) => {
    try {

      const { sessionID, students } = req.body;
      
      // Input validation
      if (!Array.isArray(students) || students.length === 0) {
        return res.status(400).json({
          message: "Invalid input. Expected array of students with studentID"
        });
      }
  
      // Validate session exists
      const session = await AttendanceSession.findOne({ sessionID });
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
  
      // Track successful and failed updates
      const results = {
        successful: [],
        failed: []
      };
  
      // Process each student attendance
      for (const studentEntry of students) {
        const { studentID } = studentEntry;
  
        // Find student in session
        const studentInSession = session.students.find(
          student => student.studentID === studentID
        );
  
        if (!studentInSession) {
          results.failed.push({
            studentID,
            reason: "Student not found in this session"
          });
          continue;
        }
  
        // Update attendance status
        studentInSession.attendanceStatus = "Present";
        
        results.successful.push({
          studentID,
          status: "Present"
        });
      }
  
      // Save the session with all updates
      if (results.successful.length > 0) {
        await session.save();
      }
  
      // Return response with details of successful and failed updates
      res.status(201).json({
        message: "Attendance processing completed",
        data: {
          session,
          results: {
            totalProcessed: students.length,
            successfulUpdates: results.successful.length,
            failedUpdates: results.failed.length,
            successful: results.successful,
            failed: results.failed
          }
        }
      });
  
    } catch (error) {
      next(error);
    }
  };

const getSessionAttendance = async (req, res, next) => {
    try {
        const { sessionID } = req.params;
        
        const session = await AttendanceSession.findOne({ sessionID })
            .populate('students.studentID', 'firstName lastName studentID -_id');

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        res.status(200).json({ data: session.students });
    } catch (error) {
        next(error);
    }
};

// Get all sessions by professor ID (POST request)
const getAllSessionsByProfessor = async (req, res, next) => {
    try {
        const { professorID } = req.params; // Get professorID from request body

        // Validate professorID
        if (!professorID) {
            return res.status(400).json({ message: "Professor ID is required" });
        }

        // Fetch sessions created by the given professor
        const sessions = await AttendanceSession.find({ createdBy: professorID });

        // If no sessions found
        if (sessions.length === 0) {
            return res.status(404).json({ message: "No sessions found for this professor" });
        }

        // Return sessions
        res.status(200).json({ data: sessions });
    } catch (error) {
        next(error);
    }
};


const getSingleSession = async (req, res, next) => {
    try {
        const session = await AttendanceSession.findOne({ sessionID: req.params.sessionID }); // Use same param name
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


const updateAttendanceStatus = async (req, res, next) => {
    try {
        const { sessionID } = req.params; // Extract from URL params
        const { status } = req.body; // Extract status from body

        // Validate status value
        if (!["active", "completed", "new"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        // Find and update session status
        const session = await AttendanceSession.findOneAndUpdate(
            { sessionID }, 
            { sessionStatus: status }, 
            { new: true }
        );

        if (!session) {
            return res.status(404).json({ message: "Attendance session not found" });
        }

        res.status(200).json({ message: "Attendance session status updated successfully", data: session });

    } catch (error) {
        next(error);
    }
};

const getAttendanceSessionsByStudent = async (req, res, next) => {
    try {
        const { studentID } = req.params;

        // Validate if the student exists
        const studentExists = await Student.findOne({ studentID });
        if (!studentExists) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Fetch all attendance sessions where the student is enrolled
        const sessions = await AttendanceSession.find({ "students.studentID": studentID });

        if (!sessions || sessions.length === 0) {
            return res.status(404).json({ message: "No attendance sessions found for this student" });
        }

        res.status(200).json({ data: sessions });
    } catch (error) {
        next(error);
    }
};



module.exports = {
    getAttendanceSessionsByStudent,
    updateAttendanceSession,
    updateAttendanceStatus,
    createAttendanceSession,
    addAttendanceEntry,
    getSessionAttendance,
    getAllSessionsByProfessor,
    getSingleSession,
    deleteSession
};