const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');

// --- 1. POST JOB (With Criteria & Safe Skills Check) ---
router.post('/', auth, async (req, res) => {
    try {
        if(req.user.role !== 'faculty' && req.user.role !== 'owner') {
             return res.status(403).json({ msg: "Access Denied" });
        }

        const { 
            title, company, type, description, location, stipend, deadline, applyLink,
            branches, years, minCgpa, maxBacklogs 
        } = req.body;
        
        console.log("📢 Posting Job:", title);

        const newOpp = new Opportunity({
            title, company, type, description, location, stipend, deadline, applyLink,
            postedBy: req.user.id,
            collegeName: req.user.collegeName || 'General',
            // ✅ Save Criteria
            eligibility: {
                branches: branches ? branches.split(',').map(s => s.trim()).filter(Boolean) : [],
                years: years ? years.split(',').map(s => s.trim()).filter(Boolean) : [],
                minCgpa: Number(minCgpa) || 0,
                maxBacklogs: Number(maxBacklogs) || 0
            }
        });

        const savedOpp = await newOpp.save();
        res.json(savedOpp);
    } catch (err) {
        console.error("❌ Post Error:", err);
        res.status(500).send('Server Error');
    }
});

// --- 2. GET JOBS (For Student) ---
router.get('/', auth, async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'student') {
             query = { 
                 $or: [
                     { collegeName: req.user.collegeName },
                     { collegeName: 'General' }, 
                     { collegeName: { $exists: false } }
                 ]
             };
        }
        const opportunities = await Opportunity.find(query).sort({ createdAt: -1 });
        res.json(opportunities);
    } catch (err) { res.status(500).send('Server Error'); }
});

// --- 3. GET FACULTY POSTS ---
router.get('/my-posts', auth, async (req, res) => {
    try {
        const posts = await Opportunity.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) { res.status(500).send('Server Error'); }
});

// --- 4. GET APPLICANTS FOR A JOB ---
router.get('/:id/applicants', auth, async (req, res) => {
    try {
        const job = await Opportunity.findById(req.params.id);
        if(!job) return res.status(404).json({ msg: "Job not found" });
        
        if(job.postedBy.toString() !== req.user.id && req.user.role !== 'owner') {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        const applications = await Application.find({ jobId: req.params.id })
            .populate('studentId', 'name email branch year cgpa')
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// --- 5. DELETE JOB ---
router.delete('/:id', auth, async (req, res) => {
    try {
        const job = await Opportunity.findById(req.params.id);
        if (!job) return res.status(404).json({ msg: 'Job not found' });
        if (job.postedBy.toString() !== req.user.id && req.user.role !== 'owner') {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await job.deleteOne();
        await Application.deleteMany({ jobId: req.params.id }); 
        res.json({ msg: 'Job removed' });
    } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;