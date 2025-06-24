const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const authMiddleware = require('../middleware/auth');

// @route   GET api/questions/product/:productId
// @desc    Get all questions for a product, structured as a tree
// @access  Public
router.get('/product/:productId', async (req, res) => {
    try {
        const questions = await Question.find({ product: req.params.productId }).populate('user', 'name avatar');
        
        const questionMap = {};
        const threadedQuestions = [];

        questions.forEach(q => {
            questionMap[q._id] = { ...q.toObject(), children: [] };
        });

        questions.forEach(q => {
            if (q.parent && questionMap[q.parent]) {
                questionMap[q.parent].children.push(questionMap[q._id]);
            } else {
                threadedQuestions.push(questionMap[q._id]);
            }
        });

        res.json(threadedQuestions);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/questions
// @desc    Create a question or an answer
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { content, productId, parentId } = req.body;
        const newQuestion = new Question({
            content,
            product: productId,
            parent: parentId,
            user: req.user.id
        });
        
        const question = await newQuestion.save();
        res.json(await question.populate('user', 'name avatar'));
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router; 