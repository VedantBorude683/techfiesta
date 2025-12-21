const express = require("express");
const router = express.Router();
const WeeklyProgress = require("../models/WeeklyProgress");
const Engagement = require("../models/Engagement");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// =======================================================
// 1. GET ALL LOGS FOR A SPECIFIC ENGAGEMENT
// URL: /api/progress/:engagementId
// =======================================================
router.get("/:engagementId", auth, async (req, res) => {
  try {
    const progress = await WeeklyProgress.find({
      engagementId: req.params.engagementId,
      studentId: req.user.id,
    }).sort({ weekNumber: 1 });
    res.json(progress);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ message: "Server error fetching logs" });
  }
});

// =======================================================
// 2. ASSIGN TASK (Broadcast & Individual)
// URL: /api/progress/assign-task
// =======================================================
router.post("/assign-task", auth, async (req, res) => {
  try {
    const { engagementId, studentId, weekNumber, tasks, isAll } = req.body;

    // Validate tasks input
    let processedTasks = [];
    if (Array.isArray(tasks)) {
      processedTasks = tasks;
    } else if (typeof tasks === 'string') {
      processedTasks = tasks.split(',').map(t => t.trim());
    } else {
      return res.status(400).json({ message: "Tasks must be an array or string" });
    }

    // --- BROADCAST LOGIC (For All Students) ---
    if (isAll) {
      // 1. Find all active students in this faculty's college
      const students = await User.find({ 
        role: "student", 
        collegeCode: req.user.collegeCode, 
        isApproved: true 
      });

      if (students.length === 0) {
        return res.status(404).json({ message: "No active students found." });
      }

      let assignedCount = 0;

      for (const student of students) {
        try {
          // 2. Find existing PROJECT
          let project = await Engagement.findOne({ 
            studentId: student._id, 
            type: "PROJECT" 
          });

          // 3. Auto-Create PROJECT if missing
          if (!project) {
            project = new Engagement({
              studentId: student._id,
              type: "PROJECT",
              title: "Semester Project",
              description: "Final Year Project / Semester Project",
              organization: student.collegeName || "College Project",
              status: "ONGOING", // Fixed Enum Case
              startDate: new Date()
            });
            await project.save();
          }

          // 4. Assign Task
          await WeeklyProgress.updateOne(
            { engagementId: project._id, weekNumber: Number(weekNumber) },
            { 
              studentId: student._id,
              tasks: processedTasks,
              reviewStatus: "ASSIGNED",
              assignedAt: Date.now()
            },
            { upsert: true }
          );
          assignedCount++;
        } catch (innerErr) {
          console.error(`❌ Failed to assign to ${student.email}:`, innerErr.message);
        }
      }

      return res.json({ message: `Task assigned to ${assignedCount} students.` });
    }

    // --- INDIVIDUAL ASSIGNMENT LOGIC ---
    const existing = await WeeklyProgress.findOne({ engagementId, weekNumber: Number(weekNumber) });
    if (existing) {
      return res.status(400).json({ message: `Week ${weekNumber} is already assigned.` });
    }

    const newTask = new WeeklyProgress({
      engagementId,
      studentId,
      weekNumber: Number(weekNumber),
      tasks: processedTasks,
      reviewStatus: "ASSIGNED"
    });

    await newTask.save();
    res.json({ message: "Task assigned successfully!", newTask });

  } catch (err) {
    console.error("🔥 CRITICAL ASSIGN ERROR:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// =======================================================
// 3. SUBMIT WORK (Student Side)
// URL: /api/progress/submit-work/:taskId
// =======================================================
router.patch("/submit-work/:taskId", auth, async (req, res) => {
  try {
    const { summary, evidenceLinks } = req.body;
    const progress = await WeeklyProgress.findById(req.params.taskId);
    if (!progress) return res.status(404).json({ message: "Task not found" });

    progress.summary = summary;
    progress.evidenceLinks = evidenceLinks;
    progress.reviewStatus = "PENDING_REVIEW";
    progress.submittedAt = Date.now();

    await progress.save();
    res.json({ message: "Work submitted!", progress });
  } catch (err) {
    console.error("Submit Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;