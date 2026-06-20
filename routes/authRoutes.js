// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 📝 1. REGISTER NEW USER
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Quick verification: Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'Username or Email already registered' });
    }

    // Create the user profile row
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: '🎉 Profile created successfully!', userId: newUser._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔑 2. LOGIN USER
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Look up user by email
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials. Please check details again.' });
    }

    res.status(200).json({
      message: `Welcome back, ${user.username}!`,
      user: { id: user._id, username: user.username, email: user.email, bio: user.bio }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;