const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');


router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }


        const user = new User({ username, password });
        await user.save();


        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ token, user: { id: user._id, username, role: user.role } });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error in registration' });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;


        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }


        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }


        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user._id, username, role: user.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error in login' });
    }
});


router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data' });
    }
});

module.exports = router;