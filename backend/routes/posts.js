const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const PostCategory = require('../models/PostCategory');
const PostRevision = require('../models/PostRevision');
const Language = require('../models/Language'); 
const authMiddleware = require('../middleware/auth');

// Helper function to get the default language ID
const getDefaultLanguageId = async () => {
    const defaultLanguage = await Language.findOne({ isDefault: true });
    return defaultLanguage ? defaultLanguage._id : null;
};

// @route   GET api/posts
// @desc    Get all posts with multi-language support
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, lang, ...queryParams } = req.query;
        let langId = lang ? (await Language.findOne({ code: lang }))?._id : await getDefaultLanguageId();
        
        // Find posts that have content in the requested language
        const posts = await Post.find({ 'localizedContent.language': langId, status: 'published' })
            .populate('author', 'name avatar')
            .populate('category', 'name slug')
            .populate('tags', 'name slug');

        // Map posts to return only the requested language content
        const localizedPosts = posts.map(post => {
            const content = post.localizedContent.find(c => c.language.equals(langId));
            return {
                ...post.toObject(),
                title: content.title,
                slug: content.slug,
                excerpt: content.excerpt,
                content: content.content,
                localizedContent: undefined // Remove the array from the final output
            };
        });

        res.json({ posts: localizedPosts });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET api/posts/:slug
// @desc    Get a single post by slug with multi-language support
// @access  Public
router.get('/:slug', async (req, res) => {
    try {
        const { lang } = req.query;
        let langId = lang ? (await Language.findOne({ code: lang }))?._id : await getDefaultLanguageId();

        const post = await Post.findOne({ 'localizedContent.slug': req.params.slug, 'localizedContent.language': langId, status: 'published' })
            .populate('author', 'name avatar')
            .populate('category', 'name slug')
            .populate('tags', 'name slug');

        if (!post) return res.status(404).json({ msg: 'Post not found' });
        
        const content = post.localizedContent.find(c => c.language.equals(langId));
        const localizedPost = {
            ...post.toObject(),
            title: content.title,
            slug: content.slug,
            excerpt: content.excerpt,
            content: content.content,
            localizedContent: undefined
        };

        res.json(localizedPost);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/posts
// @desc    Create a post with multi-language content
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newPost = new Post({
            author: req.user.id,
            localizedContent: req.body.localizedContent,
            category: req.body.category,
            tags: req.body.tags,
            type: req.body.type,
            status: req.body.status,
            template: req.body.template
        });
        const post = await newPost.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/posts/:id
// @desc    Update a post with multi-language content
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        // Authorization check
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // For simplicity, this example replaces the content. A more robust solution might merge changes.
        post.localizedContent = req.body.localizedContent;
        post.category = req.body.category;
        post.tags = req.body.tags;
        // ... update other fields ...
        
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


// Note: Revision routes remain the same but will now capture the entire localizedContent array upon update.

module.exports = router;
