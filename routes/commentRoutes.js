// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// 💬 1. ADD A COMMENT TO A POST
router.post('/', async (req, res) => {
  try {
    const { post, user, text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text cannot be empty" });
    }

    const newComment = new Comment({ post, user, text });
    await newComment.save();

    res.status(201).json({ message: "💬 Comment added successfully!", comment: newComment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔍 2. GET ALL COMMENTS FOR A SPECIFIC POST
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'username profilePicture')
      .sort({ createdAt: 1 }); // Oldest comments first (natural conversational flow)

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;