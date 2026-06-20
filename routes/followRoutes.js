// routes/followRoutes.js
const express = require('express');
const router = express.Router();
const Follower = require('../models/Follower');

// 🤝 1. FOLLOW / UNFOLLOW A USER
router.post('/toggle', async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    if (followerId === followingId) {
      return res.status(400).json({ message: "You cannot follow yourself!" });
    }

    // Check if the follow relationship already exists
    const existingFollow = await Follower.findOne({ follower: followerId, following: followingId });

    if (existingFollow) {
      // Unfollow: Delete the record
      await Follower.deleteOne({ _id: existingFollow._id });
      return res.status(200).json({ message: "💔 Unfollowed successfully", isFollowing: false });
    } else {
      // Follow: Create a new relationship record
      const newFollow = new Follower({ follower: followerId, following: followingId });
      await newFollow.save();
      return res.status(201).json({ message: "🤝 Followed successfully", isFollowing: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📊 2. GET FOLLOWERS AND FOLLOWING COUNTS
router.get('/counts/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Count records where this user is being followed
    const followersCount = await Follower.countDocuments({ following: userId });
    
    // Count records where this user is the one doing the following
    const followingCount = await Follower.countDocuments({ follower: userId });

    res.status(200).json({ followersCount, followingCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;