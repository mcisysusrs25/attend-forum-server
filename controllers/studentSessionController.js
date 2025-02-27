const AttendanceSession = require("../models/AttendanceSession");
const ClassConfiguration = require("../models/classConfiguration");

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
    const { sessionID, studentID, lat, long, timstamp } = req.body;
    console.log("got this from the client" + {sessionID, studentID, lat, long, timstamp})
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

const markAttendance1 = async (req, res, next) => {
    const { sessionID, studentID, latitude, longitude, timestamp } = req.body;
    console.log("Received data:", { sessionID, studentID, latitude, longitude, timestamp });

    try {
        // Find the session and get the associated classConfigId
        const session = await AttendanceSession.findOne({ sessionID });

        if (!session) {
            return res.status(404).json({ message: "Session not found." });
        }

        // Get the class configuration details
        const classConfig = await ClassConfiguration.findOne({ classConfigId: session.classConfigId });

        if (!classConfig) {
            return res.status(404).json({ message: "Class configuration not found." });
        }

        // Function to calculate distance between two lat-long points in meters
        const haversineDistance = (lat1, lon1, lat2, lon2) => {
            const toRad = (angle) => (Math.PI / 180) * angle;
            const R = 6371e3; // Radius of Earth in meters

            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a = 
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
                Math.sin(dLon / 2) * Math.sin(dLon / 2);

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // Distance in meters
        };

        // Calculate distance between user and configured location
        const distance = haversineDistance(classConfig.latitude, classConfig.longitude, latitude, longitude);
        
        console.log(`Calculated distance: ${distance} meters`);
        console.log(classConfig.latitude, classConfig.longitude, latitude, longitude);

        // Determine attendance status
        const attendanceStatus = distance <= 20 ? "Present" : "Absent";

        // Update attendance status
        const updatedSession = await AttendanceSession.findOneAndUpdate(
            { sessionID, "students.studentID": studentID },
            { $set: { "students.$.attendanceStatus": attendanceStatus } },
            { new: true }
        );

        if (!updatedSession) {
            return res.status(404).json({ message: "Student not found in session." });
        }

        res.status(200).json({ 
            message: `Attendance marked as ${attendanceStatus}`, 
            session: updatedSession 
        });

    } catch (err) {
        console.error("Error marking attendance:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



module.exports = { getSessionsByStudentID, markAttendance1 };
