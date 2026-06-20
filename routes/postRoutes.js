// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// 📝 1. CREATE A NEW POST
router.post('/', async (req, res) => {
  try {
    const { user, content } = req.body; // Expects user ID and text content

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Post content cannot be empty" });
    }

    const newPost = new Post({ user, content });
    await newPost.save();

    res.status(201).json({ message: "🎉 Post published successfully!", post: newPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📰 2. GET ALL POSTS (GLOBAL FEED)
router.get('/', async (req, res) => {
  try {
    // .populate('user', 'username profilePicture') pulls the author's details automatically
    const posts = await Post.find()
      .populate('user', 'username profilePicture') 
      .sort({ createdAt: -1 }); // Newest posts appear at the top

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ❤️ 3. TOGGLE LIKE STATUS ON A POST
router.put('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user has already liked this post
    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      // Unlike: Remove user ID from array
      post.likes = post.likes.filter(id => id.toString() !== userId);
      await post.save();
      return res.status(200).json({ message: "💔 Post unliked successfully", likesCount: post.likes.length });
    } else {
      // Like: Add user ID to array
      post.likes.push(userId);
      await post.save();
      return res.status(200).json({ message: "❤️ Post liked successfully", likesCount: post.likes.length });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;