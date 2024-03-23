const mongoose = require('mongoose');

// Define schema for marks
const marksSchema = new mongoose.Schema({
  subject: {
    type: String,
  },
  internalMarks: {
    type: Number,
  },
  externalMarks: {
    type: Number,
  },
  grade: {
    type: String,
  },
});

// Define schema for marksheet
const marksheetSchema = new mongoose.Schema({
  studentName: {
    type: String,
  },
  rollNumber: {
    type: String,

    unique: true,
  },
  marks: [marksSchema],
  totalMarks: {
    type: Number,
  },
  percentage: {
    type: Number,
  },
});

const Marksheet = mongoose.model('Marksheet', marksheetSchema);

module.exports = Marksheet;
