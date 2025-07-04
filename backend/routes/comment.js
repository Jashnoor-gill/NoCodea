const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Add comment to a post
router.post('/comments', async (req, res) => {
  try {
    const { postId, author, content } = req.body;
    const comment = new Comment({ post: postId, author, content });
    await comment.save();
    // Add comment to post's comments array
    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get comments for a post
router.get('/comments/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('author');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 