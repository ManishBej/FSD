// routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Get all users (admin only)
router.get('/users', [auth, isAdmin], async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});


router.put('/users/:id/role', [auth, isAdmin], async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role' });
    }
});


router.put('/users/:id/status', [auth, isAdmin], async (req, res) => {
    try {
        const { isActive } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = isActive;
        await user.save();
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user status' });
    }
});

module.exports = router;