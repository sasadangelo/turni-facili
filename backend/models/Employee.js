const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  workingHours: {
    type: String,
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',  // Riferimento alla collezione 'Company'
    required: true
  }
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
