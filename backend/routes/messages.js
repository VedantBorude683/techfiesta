const router = require('express').Router();
const Message = require('../models/Message');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// GET all messages involved with the user (Sent or Received)
router.get('/', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [{ sender: req.user.id }, { recipient: req.user.id }]
        })
        .populate('sender', 'name role')
        .populate('recipient', 'name')
        .sort({ createdAt: 1 }); // Oldest first (Chat style)
        
        res.json(messages);
    } catch (err) { res.status(500).send("Server Error"); }
});

// SEND a message
router.post('/send', auth, async (req, res) => {
    try {
        const { content, recipientEmail } = req.body;
        
        // Find Recipient by Email
        const recipientUser = await User.findOne({ email: recipientEmail });
        if(!recipientUser) return res.status(404).json({ msg: "User not found" });

        const newMessage = new Message({
            sender: req.user.id,
            recipient: recipientUser._id,
            content
        });

        await newMessage.save();
        
        // Populate sender details for immediate UI update
        await newMessage.populate('sender', 'name role');
        
        res.json(newMessage);
    } catch (err) { res.status(500).send("Server Error"); }
});

module.exports = router;