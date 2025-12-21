const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- SETUP UPLOADS FOR APPLICATIONS ---
const appResumeDir = path.join(__dirname, '../uploads/application_resumes');
if (!fs.existsSync(appResumeDir)) fs.mkdirSync(appResumeDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, appResumeDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${req.user.id}-resume.pdf`)
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDFs allowed'));
  }
});

// --- 1. APPLY TO JOB (With Mandatory Resume) ---
router.post('/apply/:jobId', auth, upload.single('resume'), async (req, res) => {
    try {
        const { jobId } = req.params;
        
        // 1. Validation: Resume is Mandatory
        if (!req.file) {
            return res.status(400).json({ msg: "Resume upload is mandatory for this application." });
        }

        // 2. Check for duplicate application
        const existing = await Application.findOne({ jobId, studentId: req.user.id });
        if (existing) {
            // Cleanup uploaded file if duplicate
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ msg: "You have already applied to this job." });
        }

        // 3. Create Application
        const resumeUrl = `http://localhost:8080/uploads/application_resumes/${req.file.filename}`;
        
        const newApp = new Application({
            jobId,
            studentId: req.user.id,
            resumeLink: resumeUrl // Save specific resume
        });

        await newApp.save();
        res.json({ msg: "Application Submitted Successfully!" });

    } catch (err) {
        console.error("Apply Error:", err);
        res.status(500).send('Server Error');
    }
});

// --- 2. GET MY APPLICATIONS (For Student) ---
router.get('/my-applications', auth, async (req, res) => {
    try {
        const apps = await Application.find({ studentId: req.user.id })
            .populate('jobId', 'title company type location status')
            .sort({ appliedAt: -1 });
        res.json(apps);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- 3. UPDATE STATUS (For Faculty) ---
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        // Verify ownership logic should ideally be here or in frontend check
        const app = await Application.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );
        res.json(app);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;