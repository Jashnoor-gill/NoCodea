const express = require('express');
const { body, validationResult } = require('express-validator');
const Return = require('../models/Return');
const ReturnReason = require('../models/ReturnReason');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const emailService = require('../services/emailService');

const router = express.Router();

// @route   GET /api/returns/reasons
// @desc    Get all return reasons
// @access  Public
router.get('/reasons', async (req, res) => {
  try {
    const reasons = await ReturnReason.getActiveReasons();
    
    res.json({
      success: true,
      data: reasons
    });
  } catch (error) {
    console.error('Get return reasons error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/returns/submit
// @desc    Submit a return request
// @access  Public
router.post('/submit', [
  body('customerOrderId', 'Order ID is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('returnReasonId', 'Return reason is required').not().isEmpty(),
  body('description', 'Description is required').isLength({ min: 10, max: 1000 }),
  body('quantity', 'Quantity must be a positive number').isInt({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array()
    });
  }

  const {
    customerOrderId,
    email,
    returnReasonId,
    description,
    quantity,
    images
  } = req.body;

  try {
    // Find order by customer order ID and email
    const order = await Order.findOne({
      customerOrderId: customerOrderId,
      'billing.email': email.toLowerCase()
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order ${customerOrderId} not found!`
      });
    }

    // Check if return already exists for this order
    const existingReturn = await Return.findOne({
      orderId: order._id,
      email: email.toLowerCase()
    });

    if (existingReturn) {
      return res.status(400).json({
        success: false,
        message: 'Return request already exists for this order'
      });
    }

    // Validate return reason
    const returnReason = await ReturnReason.findById(returnReasonId);
    if (!returnReason || !returnReason.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Invalid return reason'
      });
    }

    // Create return request
    const returnRequest = new Return({
      orderId: order._id,
      customerOrderId,
      userId: order.userId,
      email: email.toLowerCase(),
      returnReasonId,
      returnStatusId: 'pending',
      returnResolutionId: 'pending',
      productId: order.items[0]?.productId || null, // For simplicity, using first product
      quantity,
      description,
      images: images || []
    });

    await returnRequest.save();

    // Send confirmation email
    try {
      await emailService.sendReturnConfirmation(returnRequest, order);
    } catch (emailError) {
      console.error('Return confirmation email error:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: 'Return submitted successfully!',
      data: {
        returnId: returnRequest._id,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('Submit return error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting return'
    });
  }
});

// @route   GET /api/returns/user
// @desc    Get user's return requests
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    let query = { userId: req.user.id };
    if (status) {
      query.returnStatusId = status;
    }

    const returns = await Return.find(query)
      .populate('orderId')
      .populate('returnReasonId')
      .populate('returnStatusId')
      .populate('productId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Return.countDocuments(query);

    res.json({
      success: true,
      data: returns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get user returns error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/returns/:id
// @desc    Get return request details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const returnRequest = await Return.findById(req.params.id)
      .populate('orderId')
      .populate('returnReasonId')
      .populate('returnStatusId')
      .populate('productId');

    if (!returnRequest) {
      return res.status(404).json({
        success: false,
        message: 'Return request not found'
      });
    }

    // Check if user owns this return or is admin
    if (returnRequest.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: returnRequest
    });

  } catch (error) {
    console.error('Get return details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/returns/:id/cancel
// @desc    Cancel a return request
// @access  Private
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const returnRequest = await Return.findById(req.params.id);

    if (!returnRequest) {
      return res.status(404).json({
        success: false,
        message: 'Return request not found'
      });
    }

    // Check if user owns this return
    if (returnRequest.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if return can be cancelled
    if (returnRequest.returnStatusId !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Return request cannot be cancelled at this stage'
      });
    }

    returnRequest.returnStatusId = 'cancelled';
    await returnRequest.save();

    res.json({
      success: true,
      message: 'Return request cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel return error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/returns/check/:customerOrderId
// @desc    Check if order exists for return
// @access  Public
router.get('/check/:customerOrderId', async (req, res) => {
  try {
    const { customerOrderId } = req.params;
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const order = await Order.findOne({
      customerOrderId,
      'billing.email': email.toLowerCase()
    });

    if (!order) {
      return res.json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if return already exists
    const existingReturn = await Return.findOne({
      orderId: order._id,
      email: email.toLowerCase()
    });

    res.json({
      success: true,
      data: {
        orderExists: true,
        order: {
          id: order._id,
          customerOrderId: order.customerOrderId,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt
        },
        hasReturn: !!existingReturn
      }
    });

  } catch (error) {
    console.error('Check order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 