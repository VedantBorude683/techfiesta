const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const internshipRoutes = require("./routes/internship");
const adminRoutes = require("./routes/admin");
const progressRoutes = require("./routes/progressRoutes");

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register Routes
app.use('/api/opportunities', require('./routes/opportunities'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/ai-resume', require('./routes/ai-resume'));
app.use('/api/ai-interview', require('./routes/ai-interview'));
app.use('/api/ai-chatbot', require('./routes/ai-chatbot'));
app.use("/api/engagements", require("./routes/engagementRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));
app.use("/api/faculty", require("./routes/facultyReviewRoutes"));
app.use("/api/internship", internshipRoutes);
app.use("/api/admin", adminRoutes); 
app.use("/api/progressRoutes", progressRoutes);
app.use('/api/messages', require('./routes/messages'));

// --- DATABASE CONNECTION ---
const connectDB = async () => {
    try {
        console.log("⏳ Attempting to connect to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000 
        });
        console.log('✅ MongoDB Connected Successfully');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1); 
    }
};

connectDB().then(() => {
    // Routes requiring DB connection
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/owner', require('./routes/owner')); // 👈 ADDED OWNER ROUTES
    app.use('/api/notifications', require('./routes/notifications'));
  
    // 👇 CHANGED PORT TO 8080 TO MATCH FRONTEND
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});