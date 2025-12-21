const mongoose = require('mongoose');

const SystemSettingSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false },
  allowStudentRegistration: { type: Boolean, default: true },
  allowFacultyRegistration: { type: Boolean, default: true },
  systemEmail: { type: String, default: 'support@campusconnect.com' },
  currentVersion: { type: String, default: '1.0.0' }
}, { timestamps: true });

// We only need one document for this collection
module.exports = mongoose.model('SystemSetting', SystemSettingSchema);