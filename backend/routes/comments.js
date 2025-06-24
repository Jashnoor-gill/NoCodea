const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/auth');
const sanitizeHtml = require('sanitize-html');

// @route   GET api/comments/post/:postId
// @desc    Get all approved comments for a post, structured as a tree
// @access  Public
router.get('/post/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId, status: 'approved' })
            .populate('author', 'name avatar')
            .sort({ createdAt: 'asc' });

        const commentMap = {};
        const threadedComments = [];

        comments.forEach(comment => {
            commentMap[comment._id] = { ...comment.toObject(), children: [] };
        });

        comments.forEach(comment => {
            if (comment.parent && commentMap[comment.parent]) {
                commentMap[comment.parent].children.push(commentMap[comment._id]);
            } else {
                threadedComments.push(commentMap[comment._id]);
            }
        });

        res.json(threadedComments);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/comments
// @desc    Create a comment
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { content, postId, parentId, honeypot } = req.body;

        // Honeypot check for basic spam prevention
        if (honeypot) {
            return res.status(400).json({ msg: 'Spam detected' });
        }

        const sanitizedContent = sanitizeHtml(content, {
            allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
            allowedAttributes: { 'a': ['href'] }
        });

        const newComment = new Comment({
            content: sanitizedContent,
            post: postId,
            parent: parentId,
            author: req.user.id,
            status: 'pending' // Default status for moderation
        });
        
        const comment = await newComment.save();
        res.json(await comment.populate('author', 'name avatar'));
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router; 