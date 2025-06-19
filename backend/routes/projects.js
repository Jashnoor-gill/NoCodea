const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/projects
// @desc    Get user's projects
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      $or: [
        { owner: req.user._id },
        { 'collaborators.user': req.user._id }
      ]
    };

    // Add category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Add status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Add search filter
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(filter)
      .populate('owner', 'name avatar')
      .populate('collaborators.user', 'name avatar')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments(filter);

    res.json({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private
router.post('/', auth, [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Project name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('category')
    .optional()
    .isIn(['business', 'portfolio', 'blog', 'ecommerce', 'landing', 'other'])
    .withMessage('Invalid category'),
  body('template')
    .optional()
    .isMongoId()
    .withMessage('Invalid template ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errors.array()
      });
    }

    const { name, description, category, template, elements, settings } = req.body;

    const project = new Project({
      name,
      description,
      category: category || 'other',
      owner: req.user._id,
      template,
      elements: elements || [],
      settings: settings || {}
    });

    await project.save();

    // Update user stats
    req.user.stats.projectsCreated += 1;
    await req.user.save();

    // Populate owner info
    await project.populate('owner', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name avatar')
      .populate('collaborators.user', 'name avatar')
      .populate('template', 'name description thumbnail');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user has access
    const isOwner = project.owner._id.toString() === req.user._id.toString();
    const isCollaborator = project.collaborators.some(
      collab => collab.user._id.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollaborator && project.visibility === 'private') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: project
    });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', auth, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Project name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('category')
    .optional()
    .isIn(['business', 'portfolio', 'blog', 'ecommerce', 'landing', 'other'])
    .withMessage('Invalid category'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Invalid status'),
  body('visibility')
    .optional()
    .isIn(['private', 'public', 'unlisted'])
    .withMessage('Invalid visibility')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errors.array()
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is owner or has edit permissions
    const isOwner = project.owner.toString() === req.user._id.toString();
    const collaboration = project.collaborators.find(
      collab => collab.user.toString() === req.user._id.toString()
    );
    const canEdit = isOwner || (collaboration && ['editor', 'admin'].includes(collaboration.role));

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to edit this project.'
      });
    }

    // Update project
    const updateFields = {};
    const allowedFields = ['name', 'description', 'category', 'status', 'visibility', 'elements', 'settings', 'pages', 'tags'];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('owner', 'name avatar');

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only the project owner can delete this project.'
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/projects/:id/collaborators
// @desc    Add collaborator to project
// @access  Private
router.post('/:id/collaborators', auth, [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .isIn(['viewer', 'editor', 'admin'])
    .withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errors.array()
      });
    }

    const { email, role } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only the project owner can add collaborators.'
      });
    }

    // Find user by email
    const User = require('../models/User');
    const collaborator = await User.findOne({ email });
    if (!collaborator) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already a collaborator
    const existingCollaboration = project.collaborators.find(
      collab => collab.user.toString() === collaborator._id.toString()
    );

    if (existingCollaboration) {
      return res.status(400).json({
        success: false,
        message: 'User is already a collaborator'
      });
    }

    // Add collaborator
    project.collaborators.push({
      user: collaborator._id,
      role
    });

    await project.save();

    res.json({
      success: true,
      message: 'Collaborator added successfully',
      data: project
    });

  } catch (error) {
    console.error('Add collaborator error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/projects/:id/collaborators/:userId
// @desc    Remove collaborator from project
// @access  Private
router.delete('/:id/collaborators/:userId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only the project owner can remove collaborators.'
      });
    }

    // Remove collaborator
    project.collaborators = project.collaborators.filter(
      collab => collab.user.toString() !== req.params.userId
    );

    await project.save();

    res.json({
      success: true,
      message: 'Collaborator removed successfully',
      data: project
    });

  } catch (error) {
    console.error('Remove collaborator error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/projects/:id/duplicate
// @desc    Duplicate project
// @access  Private
router.post('/:id/duplicate', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user has access
    const isOwner = project.owner.toString() === req.user._id.toString();
    const isCollaborator = project.collaborators.some(
      collab => collab.user.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollaborator && project.visibility === 'private') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Create duplicate
    const duplicate = new Project({
      name: `${project.name} (Copy)`,
      description: project.description,
      owner: req.user._id,
      elements: project.elements,
      settings: project.settings,
      pages: project.pages,
      category: project.category,
      tags: project.tags
    });

    await duplicate.save();

    // Update user stats
    req.user.stats.projectsCreated += 1;
    await req.user.save();

    res.status(201).json({
      success: true,
      message: 'Project duplicated successfully',
      data: duplicate
    });

  } catch (error) {
    console.error('Duplicate project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 