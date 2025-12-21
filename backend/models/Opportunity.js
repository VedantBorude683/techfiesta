const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Internship', 'Job', 'Hackathon', 'Workshop'], 
    required: true 
  },
  collegeName: { type: String, required: true }, // Crucial for filtering
  
  // ✅ New Eligibility Criteria
  eligibility: {
      branches: [{ type: String }], // e.g. ['CSE', 'IT']
      years: [{ type: String }],    // e.g. ['3rd Year', '4th Year']
      minCgpa: { type: Number, default: 0 },
      maxBacklogs: { type: Number, default: 0 }
  },

  location: { type: String, default: 'Remote' },
  stipend: { type: String, default: 'Unpaid' },
  description: { type: String },
  deadline: { type: Date, required: true },
  
  // ✅ Optional: If empty, it's an internal application
  applyLink: { type: String }, 
  
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Opportunity', OpportunitySchema);