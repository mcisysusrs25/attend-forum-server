const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subjectCode: { 
    type: String, 
    required: true, 
    unique: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  professorID: { 
    type: String, 
    required: true,
    index: true // Add index for better query performance, but not unique
  }
}, {
  timestamps: true // Optional: adds createdAt and updatedAt fields
});

// Add compound index if you need to query subjects by professor often
subjectSchema.index({ professorID: 1, subjectCode: 1 });

module.exports = mongoose.model("Subject", subjectSchema);