const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'fintrack_secret_key_2026';

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const errors = {};
    if (!name || name.trim() === '') errors.name = 'Please fill the field';
    if (!email || email.trim() === '') errors.email = 'Please fill the field';
    if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, errors: { email: 'Email already exists' } });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const errors = {};
    if (!email || email.trim() === '') errors.email = 'Please fill the field';
    if (!password || password.trim() === '') errors.password = 'Please fill the field';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, errors: { email: 'Invalid email or password' } });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, errors: { password: 'Invalid email or password' } });
    }

    const token = jwt.sign({ userId: user._id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;