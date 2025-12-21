const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty', 'owner'], default: 'student' },
  
  // --- Profile Fields ---
  collegeName: { type: String, default: '' },
  collegeCode: { type: String, sparse: true }, // Used to link Student to Faculty
  branch: { type: String, default: '' },
  year: { type: String, default: '' },
  cgpa: { type: String, default: '' },

  // --- Extended Profile Fields ---
  about: { type: String, default: '' },
  skills: { type: [String], default: [] },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  resumeLink: { type: String, default: '' },
  profilePic: { type: String, default: '' }, 
  coverPic: { type: String, default: '' },
  headline: { type: String, default: '' },
  
  // --- Verification Fields ---
  // Stores the URL for Faculty Proof OR Student ID Card
  verificationDoc: { type: String, default: '' }, 
  
  // Email OTP verification status
  isVerified: { type: Boolean, default: false },   
  
  // Admin/Faculty Approval status
  // CHANGED: Defaults to false. Students need Faculty approval; Faculty needs Owner approval.
  isApproved: { type: Boolean, default: false },    
  
  otp: String,
  otpExpires: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);