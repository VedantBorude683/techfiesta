const express = require("express");
const router = express.Router();
const Engagement = require("../models/Engagement");
const WeeklyProgress = require("../models/WeeklyProgress");
const auth = require("../middleware/authMiddleware");
const multer = require("multer");

// ===================== MULTER CONFIG (File Uploads) =====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/certificates");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF or image files allowed"));
    }
  },
});

// =======================================================
// GET MY ENGAGEMENTS (With 'hasTasks' Flag)
// URL: /api/engagements/my
// =======================================================
router.get("/my", auth, async (req, res) => {
  try {
    // Fetch all engagements for the logged-in student
    const engagements = await Engagement.find({
      studentId: req.user.id,
    }).sort({ createdAt: -1 });

    // Calculate Progress & Check for Tasks
    const result = await Promise.all(
      engagements.map(async (eng) => {
        const engObj = eng.toObject();

        if (eng.type === "PROJECT") {
          // Check if Admin has assigned any tasks for this project
          const logs = await WeeklyProgress.find({ engagementId: eng._id });

          // Progress Calculation (Based on Approved Logs)
          const approved = logs.filter(l => l.reviewStatus === "APPROVED").length;
          const totalWeeks = 10; // Assuming a 10-week semester
          engObj.progress = Math.min((approved / totalWeeks) * 100, 100);

          // VISIBILITY FLAG:
          // The project will only show up on the dashboard IF logs exist.
          // This prevents empty "Semester Projects" from cluttering the UI.
          engObj.hasTasks = logs.length > 0;
        } else {
          // Internships (No weekly logs logic for now)
          engObj.progress = 0;
          engObj.hasTasks = true; // Always show active internships
        }
        return engObj;
      })
    );

    res.json(result);
  } catch (err) {
    console.error("Fetch Engagements Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// =======================================================
// UPLOAD INTERNSHIP CERTIFICATE
// URL: /api/engagements/:id/upload-certificate
// =======================================================
router.post(
  "/:id/upload-certificate",
  auth,
  upload.single("certificate"),
  async (req, res) => {
    try {
      const engagement = await Engagement.findById(req.params.id);

      if (!engagement) {
        return res.status(404).json({ message: "Engagement not found" });
      }

      if (engagement.type !== "INTERNSHIP") {
        return res.status(403).json({ message: "Allowed only for internships" });
      }

      if (engagement.status !== "COMPLETED") {
        return res.status(403).json({ message: "Internship must be completed" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      engagement.certificate = `/uploads/certificates/${req.file.filename}`;
      engagement.certificateStatus = "PENDING_VERIFICATION";

      await engagement.save();

      res.json({
        message: "Certificate uploaded successfully",
        certificate: engagement.certificate,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;