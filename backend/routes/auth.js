
const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const auth = require('../middleware/authMiddleware');

// --- 1. SETUP UPLOADS ---
// Ensure upload directories exist
const uploadDir = path.join(__dirname, '../uploads');
const avatarDir = path.join(__dirname, '../uploads/avatars'); // Subfolder for organization
const verifyDir = path.join(__dirname, '../uploads/verification');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });
if (!fs.existsSync(verifyDir)) fs.mkdirSync(verifyDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'avatar' || file.fieldname === 'cover') {
        cb(null, avatarDir);
    } else if (file.fieldname === 'verificationDoc' || file.fieldname === 'idCard') {
        cb(null, verifyDir);
    } else {
        cb(null, uploadDir);
    }
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only .pdf, .jpg, and .png files are allowed!'));
  }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// --- REGISTER ROUTE ---
router.post('/register', (req, res, next) => {
    upload.single('verificationDoc')(req, res, (err) => {
        if (err) return res.status(400).json({ msg: `Upload Error: ${err.message}` });
        next();
    });
}, async (req, res) => {
    try {
        const { name, email, password, role, state, district, taluka, collegeName } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        // 🛑 RESTRICT ONE FACULTY PER COLLEGE
        if (role === 'faculty') {
            const existingFaculty = await User.findOne({ role: 'faculty', collegeName: collegeName });
            if (existingFaculty) {
                return res.status(400).json({ msg: 'A Faculty Admin for this college is already registered.' });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const otp = generateOTP();

        let newUserObj = {
            name, email, password: hashedPassword, role,
            otp, otpExpires: Date.now() + 10 * 60 * 1000,
            isVerified: false,
            isApproved: false // Default false for everyone
        };

        if (role === 'faculty') {
            if (!req.file) return res.status(400).json({ msg: 'Verification document missing' });
            newUserObj.state = state;
            newUserObj.district = district;
            newUserObj.taluka = taluka;
            newUserObj.collegeName = collegeName;
            newUserObj.collegeCode = 'FAC-' + Math.floor(1000 + Math.random() * 9000);
            newUserObj.verificationDoc = `http://localhost:8080/uploads/verification/${req.file.filename}`;
        } 
        
        user = new User(newUserObj);
        await user.save();

        if (process.env.EMAIL_USER) {
            await transporter.sendMail({
                from: '"CampusConnect" <' + process.env.EMAIL_USER + '>',
                to: email, subject: 'Verify Your Account', text: `Your OTP is: ${otp}`
            });
        }

        res.json({ msg: 'Registration successful!', userId: user._id });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// --- VERIFY OTP ROUTE ---
router.post('/verify-otp', async (req, res) => {
    const { userId, otp } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ msg: 'User not found' });
        if (user.otp !== otp) return res.status(400).json({ msg: 'Invalid OTP' });

        user.isVerified = true;
        user.otp = undefined; 
        await user.save();

        // For faculty, they are done with registration steps but need approval
        if (user.role === 'faculty') {
            return res.json({ msg: "Verified", role: 'faculty', collegeCode: user.collegeCode });
        }

        res.json({ msg: "Verified", role: 'student' });
    } catch (err) { res.status(500).send('Server Error'); }
});

// --- 🆕 COMPLETE STUDENT PROFILE (Step 3) ---
router.post('/complete-profile', upload.single('idCard'), async (req, res) => {
    try {
        const { userId, collegeCode, branch, year, cgpa } = req.body;
        
        if (!req.file) return res.status(400).json({ msg: "ID Card Upload is Mandatory" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: "User not found" });

        // Verify College Code
        const faculty = await User.findOne({ collegeCode: collegeCode, role: 'faculty' });
        if (!faculty) return res.status(400).json({ msg: "Invalid College Code. Ask your Faculty." });

        user.collegeName = faculty.collegeName;
        user.collegeCode = collegeCode;
        user.branch = branch;
        user.year = year;
        user.cgpa = cgpa;
        user.verificationDoc = `http://localhost:8080/uploads/verification/${req.file.filename}`;
        user.isApproved = false; // Must be approved by faculty

        await user.save();

        res.json({ msg: "Profile Completed. Pending Faculty Approval." });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "User not found" });
        if(user.role==='owner'){
             const token = jwt.sign(
                { user: { id: 'owner_id', role: 'owner' } }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1d' }
            );
            return res.status(200).json({ 
                token, 
                role: 'owner', 
                name: user.name 
            });
        }
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ msg: "Invalid Credentials" });

        if (!user.isVerified) return res.status(403).json({ msg: "Please verify your email first." });

        // 🛑 CHECK APPROVAL FOR BOTH FACULTY AND STUDENT
        if (!user.isApproved) {
            const msg = user.role === 'faculty' 
                ? "Account pending approval by Platform Owner." 
                : "Account pending approval by Faculty Admin.";
            return res.status(403).json({ msg });
        }

        const token = jwt.sign(
            { user: { id: user.id, role: user.role, collegeCode: user.collegeCode, collegeName: user.collegeName } }, 
            process.env.JWT_SECRET, { expiresIn: '1d' }
        );

        res.status(200).json({ token, role: user.role, name: user.name, collegeName: user.collegeName });

    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
});
// --- 6. GET CURRENT USER PROFILE ---
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- 7. UPDATE PROFILE (Fixed Skills Crash + Added Name Update) ---
router.put('/profile', auth, async (req, res) => {
    try {
        const { 
            name, headline, about, skills, linkedin, github, 
            resumeLink, branch, year, cgpa,
            profilePic, coverPic // Check if these are sent (e.g. empty string to delete)
        } = req.body;
        
        let user = await User.findById(req.user.id);
        if(!user) return res.status(404).json({ msg: "User not found" });

        // Update fields
        if(name) user.name = name;
        if(headline !== undefined) user.headline = headline; // Save Headline
        if(about !== undefined) user.about = about;
        if(linkedin !== undefined) user.linkedin = linkedin;
        if(github !== undefined) user.github = github;
        if(resumeLink !== undefined) user.resumeLink = resumeLink;
        if(branch !== undefined) user.branch = branch;
        if(year !== undefined) user.year = year;
        if(cgpa !== undefined) user.cgpa = cgpa;

        // Handle Image Deletion (If frontend sends empty string)
        if(profilePic === '') user.profilePic = '';
        if(coverPic === '') user.coverPic = '';

        // Robust Skills Handling
        if (skills) {
            if (Array.isArray(skills)) {
                user.skills = skills;
            } else if (typeof skills === 'string') {
                user.skills = skills.split(',').map(s => s.trim()).filter(s => s !== "");
            }
        }

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
// --- 8. FILE UPLOAD ROUTES (Missing in your file) ---
const handleProfileUpload = async (req, res, fieldName) => {
    try {
        if (!req.file) return res.status(400).json({ msg: "No file uploaded" });
        
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        // Determine correct path URL
        let folder = 'uploads';
        if(fieldName === 'profilePic' || fieldName === 'coverPic') {
             folder = 'uploads/avatars';
        }
        
        const fileUrl = `http://localhost:8080/${folder}/${req.file.filename}`;
        
        user[fieldName] = fileUrl;
        await user.save();

        res.json({ url: fileUrl, msg: "Upload successful" });
    } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).send('Server Error');
    }
};

router.post('/upload-avatar', auth, upload.single('avatar'), (req, res) => handleProfileUpload(req, res, 'profilePic'));
router.post('/upload-cover', auth, upload.single('cover'), (req, res) => handleProfileUpload(req, res, 'coverPic'));
router.post('/upload-resume', auth, upload.single('resume'), (req, res) => handleProfileUpload(req, res, 'resumeLink'));
// --- 9. CHANGE PASSWORD ---
router.put('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Incorrect current password" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        await user.save();
        res.json({ msg: "Password updated successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
