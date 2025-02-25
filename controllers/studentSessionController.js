const AttendanceSession = require("../models/AttendanceSession");

// Get sessions by studentID
const getSessionsByStudentID = async (req, res, next) => {
    const { studentID } = req.params;

    try {
        const sessions = await AttendanceSession.find({ "students.studentID": studentID });

        if (!sessions || sessions.length === 0) {
            return res.status(404).json({ message: "No sessions found for this student." });
        }
        
        res.status(200).json({ data: sessions });


    } catch (err) {
        console.error("Error fetching sessions:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Mark attendance for a student in a session
const markAttendance = async (req, res, next) => {
    const { sessionID, studentID } = req.body;

    try {
        const updatedSession = await AttendanceSession.findOneAndUpdate(
            { sessionID, "students.studentID": studentID },
            { $set: { "students.$.attendanceStatus": "Present" } },
            { new: true }
        );

        if (!updatedSession) {
            return res.status(404).json({ message: "Session or student not found." });
        }

        res.status(200).json({ message: "Attendance marked successfully.", session: updatedSession });
    } catch (err) {
        console.error("Error marking attendance:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { getSessionsByStudentID, markAttendance };
