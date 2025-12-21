const router = require('express').Router();
const User = require('../models/User');
const SystemSetting = require('../models/SystemSetting'); // Ensure this model exists
const auth = require('../middleware/authMiddleware');

const isOwner = (req, res, next) => {
    if (req.user.role !== 'owner') return res.status(403).json({ msg: "Access Denied" });
    next();
};

// 1. GET DASHBOARD STATS
router.get('/stats', auth, isOwner, async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalFaculty = await User.countDocuments({ role: 'faculty' });
        const pendingFaculty = await User.countDocuments({ role: 'faculty', isApproved: false });
        const revenue = (totalStudents * 500) + (totalFaculty * 1000); 

        res.json({ totalStudents, totalFaculty, pendingFaculty, revenue, growth: 12.5 });
    } catch (err) { res.status(500).send('Server Error'); }
});

// 2. GET ACTIVITY LOGS
router.get('/activity-logs', auth, isOwner, async (req, res) => {
    try {
        const recentUsers = await User.find().select('name role createdAt').sort({ createdAt: -1 }).limit(5);
        const logs = recentUsers.map(user => ({
            id: user._id,
            message: `New ${user.role} registered: ${user.name}`,
            time: user.createdAt
        }));
        res.json(logs);
    } catch (err) { res.status(500).send('Server Error'); }
});

// 3. GET PENDING FACULTY
router.get('/pending-faculty', auth, isOwner, async (req, res) => {
    try {
        const pendingUsers = await User.find({ role: 'faculty', isApproved: false }).select('-password').sort({ createdAt: -1 });
        res.json(pendingUsers);
    } catch (err) { res.status(500).send('Server Error'); }
});

// 4. VERIFY FACULTY
router.put('/verify-faculty/:id', auth, isOwner, async (req, res) => {
    const { action } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        if (action === 'approve') {
            user.isApproved = true;
            await user.save();
            res.json({ msg: "Faculty Approved" });
        } else if (action === 'reject') {
            await User.findByIdAndDelete(req.params.id);
            res.json({ msg: "Faculty Rejected" });
        }
    } catch (err) { res.status(500).send('Server Error'); }
});

// 5. GET ALL USERS
router.get('/all-users', auth, isOwner, async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'owner' } }).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) { res.status(500).send('Server Error'); }
});

// 6. DELETE USER
router.delete('/delete-user/:id', auth, isOwner, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: "User deleted" });
    } catch (err) { res.status(500).send('Server Error'); }
});

// 7. GET COLLEGES
router.get('/colleges', auth, isOwner, async (req, res) => {
    try {
        const colleges = await User.find({ role: 'faculty', isApproved: true })
            .select('collegeName collegeCode name email state district')
            .sort({ collegeName: 1 });
        res.json(colleges);
    } catch (err) { res.status(500).send('Server Error'); }
});

// 8. SYSTEM SETTINGS (Requires SystemSetting model)
router.get('/settings', auth, isOwner, async (req, res) => {
    try {
        let settings = await SystemSetting.findOne();
        if (!settings) { settings = new SystemSetting(); await settings.save(); }
        res.json(settings);
    } catch (err) { res.status(500).send('Server Error'); }
});

router.put('/settings', auth, isOwner, async (req, res) => {
    try {
        const { maintenanceMode, allowStudentRegistration, allowFacultyRegistration, systemEmail } = req.body;
        let settings = await SystemSetting.findOne();
        if (!settings) settings = new SystemSetting();
        
        settings.maintenanceMode = maintenanceMode;
        settings.allowStudentRegistration = allowStudentRegistration;
        settings.allowFacultyRegistration = allowFacultyRegistration;
        if(systemEmail) settings.systemEmail = systemEmail;
        
        await settings.save();
        res.json(settings);
    } catch (err) { res.status(500).send('Server Error'); }
});

// 10. GET COLLEGE DETAILS (Faculty + Students by Year)
router.get('/college-details/:code', auth, isOwner, async (req, res) => {
    try {
        const { code } = req.params;

        // 1. Find the Faculty (Admin) for this college
        const faculty = await User.findOne({ role: 'faculty', collegeCode: code })
            .select('name email collegeName collegeCode');

        if (!faculty) {
            return res.status(404).json({ msg: "College/Faculty not found" });
        }

        // 2. Find all Students in this college
        const students = await User.find({ role: 'student', collegeCode: code })
            .select('name email branch year cgpa')
            .sort({ year: 1, name: 1 });

        // 3. Segregate Students by Year
        const studentsByYear = students.reduce((acc, student) => {
            const year = student.year || 'Unknown Year';
            if (!acc[year]) acc[year] = [];
            acc[year].push(student);
            return acc;
        }, {});

        res.json({
            faculty,
            studentsByYear,
            totalStudents: students.length
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
module.exports = router;