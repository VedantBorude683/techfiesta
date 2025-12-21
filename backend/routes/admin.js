const express = require("express");
const router = express.Router();
const WeeklyProgress = require("../models/WeeklyProgress");
const Engagement = require("../models/Engagement");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// =======================================================
// 1. DASHBOARD METRICS (Stats Cards)
// URL: /api/admin/dashboard-stats
// =======================================================
router.get("/dashboard-stats", auth, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const activeProjects = await Engagement.countDocuments({ type: "PROJECT" });
    const pendingApprovals = await WeeklyProgress.countDocuments({ reviewStatus: "PENDING_REVIEW" });
    const completedInternships = await Engagement.countDocuments({ type: "INTERNSHIP", status: "COMPLETED" });

    const totalLogs = await WeeklyProgress.countDocuments();
    const approvedLogs = await WeeklyProgress.countDocuments({ reviewStatus: "APPROVED" });
    const placementRate = totalLogs > 0 ? ((approvedLogs / totalLogs) * 100).toFixed(1) : 0;

    res.json({
      totalStudents,
      activeProjects,
      pendingApprovals,
      completedInternships,
      placementRate
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
});

// =======================================================
// 2. GET PENDING STUDENT REGISTRATIONS (User Management)
// URL: /api/admin/pending-students
// =======================================================
router.get("/pending-students", auth, async (req, res) => {
    try {
        if (req.user.role !== 'faculty') return res.status(403).json({ msg: "Access Denied" });

        const students = await User.find({
            role: 'student',
            collegeCode: req.user.collegeCode,
            isVerified: true,   // Email verified
            isApproved: false   // Faculty approval pending
        }).select('name email branch year cgpa verificationDoc createdAt');

        res.json(students);
    } catch (err) {
        res.status(500).json({ message: "Error fetching pending students" });
    }
});

// =======================================================
// 3. VERIFY STUDENT REGISTRATION (Approve/Reject)
// URL: /api/admin/verify-student
// =======================================================
router.post("/verify-student", auth, async (req, res) => {
    try {
        const { studentId, action } = req.body;
        
        const student = await User.findById(studentId);
        if (!student) return res.status(404).json({ msg: "Student not found" });

        if (student.collegeCode !== req.user.collegeCode) {
            return res.status(403).json({ msg: "Unauthorized" });
        }

        if (action === 'approve') {
            student.isApproved = true;
            await student.save();
            res.json({ msg: "Student Approved" });
        } else if (action === 'reject') {
            await User.findByIdAndDelete(studentId);
            res.json({ msg: "Student Rejected" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error verifying student" });
    }
});

// =======================================================
// 4. GET ALL APPROVED STUDENTS (For Task Assignment Sidebar)
// URL: /api/admin/all-students
// =======================================================
router.get("/approved-students", auth, async (req, res) => {
    try {
        if (req.user.role !== 'faculty') return res.status(403).json({ msg: "Access Denied" });

        const students = await User.find({
            role: 'student',
            collegeCode: req.user.collegeCode,
            isApproved: true
        }).select('name email branch year cgpa profilePic');

        res.json(students);
    } catch (err) {
        res.status(500).json({ message: "Error fetching approved students" });
    }
});

// =======================================================
// 5. GET PENDING TASK SUBMISSIONS (For Review Queue)
// URL: /api/admin/pending-approvals
// =======================================================
router.get("/pending-approvals", auth, async (req, res) => {
  try {
    if (req.user.role !== 'faculty') return res.status(403).json({ message: "Access denied" });

    const pendingLogs = await WeeklyProgress.find({ reviewStatus: "PENDING_REVIEW" })
      .populate('studentId', 'name email collegeCode')
      .populate('engagementId', 'title type');

    // Filter to show only students from this faculty's college
    const filteredLogs = pendingLogs.filter(log => 
      log.studentId && log.studentId.collegeCode === req.user.collegeCode
    );

    const formattedLogs = filteredLogs.map(log => ({
      _id: log._id,
      weekNumber: log.weekNumber,
      studentName: log.studentId.name,
      projectTitle: log.engagementId ? log.engagementId.title : "Unknown Project",
      summary: log.summary,
      evidenceLinks: log.evidenceLinks,
      tasks: log.tasks,
      submittedAt: log.submittedAt,
      engagementId: log.engagementId?._id, 
      studentId: log.studentId._id
    }));

    res.json(formattedLogs);
  } catch (err) {
    console.error("Error fetching approvals:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// =======================================================
// 6. REVIEW TASK LOG (Approve/Reject)
// URL: /api/admin/review-log/:id
// =======================================================
router.patch("/review-log/:id", auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const log = await WeeklyProgress.findById(req.params.id);
    if (!log) return res.status(404).json({ message: "Log not found" });

    log.reviewStatus = status;
    log.reviewedAt = Date.now();
    await log.save();

    res.json({ message: `Log marked as ${status}`, log });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// =======================================================
// 7. SYSTEM AUDIT LOGS
// URL: /api/admin/audit-logs
// =======================================================
router.get("/audit-logs", auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const recentSubmissions = await WeeklyProgress.find()
      .populate("studentId", "name")
      .populate("engagementId", "title type")
      .sort({ updatedAt: -1 })
      .limit(limit);

    const activities = recentSubmissions.map(item => ({
      id: item._id,
      userName: item.studentId?.name || "System",
      action: item.reviewStatus === "PENDING_REVIEW" ? "submitted work for" : `milestone ${item.reviewStatus.toLowerCase()} for`,
      targetName: item.engagementId?.title || "Project",
      type: item.engagementId?.type || "PROJECT",
      timeAgo: "Recently"
    }));

    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: "Error fetching audit logs" });
  }
});

module.exports = router;