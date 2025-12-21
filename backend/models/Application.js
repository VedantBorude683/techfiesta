const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Opportunity', 
    required: true 
  },
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // ✅ Store the specific resume used for this application
  resumeLink: { type: String, required: true },
  
  status: { 
    type: String, 
    enum: ['Pending', 'Shortlisted', 'Accepted', 'Rejected'], 
    default: 'Pending' 
  },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);