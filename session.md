// attendence session. 

Now. lets work on creating an attendance sessions. Professor can create an attendance sessions, a subject can have multiple sessions. session needs, session title, , let's write an attendance session CRUD api's

StudentAttendenceSession
(Session TItle, session Description, attendenceSessionForDate, SubjectCode, CreatedBy, students(arry of student info))

// session id will be generated using the uuid. 

when editing the session details, serer check all the validations, either the session exist. 
// on createing a session, server checks the Subject Code exist, and CreatedBy alias of ProfessiorID, exist in the professor collection. 

follow this model: 

// Professor.js
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const professorSchema = new mongoose.Schema({
    professorName: { type: String, required: true },
    professorID: { type: String, required: true, unique: true, default: uuidv4 }
});

module.exports = mongoose.model("Professor", professorSchema);


Once all the verifications passed it will create an session. 


students will be the arry of students, in which the each student attendence will be marked as either present or false. by default it will be false. 

the nested student collection will have an student info - Student First Name, Last Name, Id and Attendence Status ). 


Refer this student model for reference. 

// models/Student.js
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true }, // First name of the student
    lastName: { type: String, required: true }, // Last name of the student
    studentID: { type: String, required: true, unique: true, default: uuidv4 }, // Unique student ID
    studentEmail: { type: String, required: true, unique: true } // Unique student email
});

module.exports = mongoose.model("Student", studentSchema);
