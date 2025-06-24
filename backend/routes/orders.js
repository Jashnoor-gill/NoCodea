const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const authMiddleware = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

router.use(authMiddleware);

// @route   POST api/orders
// @desc    Create an order from the user's cart
// @access  Private
router.post('/', async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ msg: 'Cart is empty' });
        }

        // This is a simplified checkout. A real app would have payment processing here.
        const order = new Order({
            user: req.user.id,
            items: cart.items.map(item => ({
                product: item.product._id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.basePrice,
            })),
            total: cart.items.reduce((acc, item) => acc + (item.product.basePrice * item.quantity), 0),
            status: 'completed' // Assuming payment is successful
        });

        await order.save();
        
        // Clear the cart after successful order
        cart.items = [];
        cart.coupon = null;
        await cart.save();

        res.status(201).json(order);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET api/orders
// @desc    Get user's order history
// @access  Private
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.product', 'name slug images') // Populate product details for the list view
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET api/orders/:id
// @desc    Get a single order by ID
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user.id })
            .populate('user', 'name email')
            .populate({
                path: 'items.product',
                populate: { path: 'manufacturer vendor' } // Deep populate
            });

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        res.json(order);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/orders/track
// @desc    Track order by order ID and email
// @access  Public
router.post('/track', [
  body('customerOrderId', 'Order ID is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  const { customerOrderId, email } = req.body;

  try {
    const order = await Order.findOne({
      orderNumber: customerOrderId,
      'customer.email': email.toLowerCase()
    }).populate('items.product', 'name image slug');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found!'
      });
    }

    res.json({
      success: true,
      data: order,
      message: 'Order found!'
    });
  } catch (error) {
    console.error('Order tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking order'
    });
  }
});

// @route   GET api/users/orders
// @desc    Get user orders with pagination and filtering
// @access  Private
router.get('/users/orders', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let query = { 'customer.user': req.user.id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('items.product', 'name image slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
});

// @route   GET api/users/orders/:id
// @desc    Get specific user order
// @access  Private
router.get('/users/orders/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      'customer.user': req.user.id
    }).populate('items.product', 'name image slug description');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order'
    });
  }
});

// @route   POST api/users/orders/:id/cancel
// @desc    Cancel user order
// @access  Private
router.post('/users/orders/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      'customer.user': req.user.id,
      status: { $in: ['pending', 'processing'] }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or cannot be cancelled'
      });
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order'
    });
  }
});

// @route   POST api/users/orders/:id/reorder
// @desc    Reorder items from a previous order
// @access  Private
router.post('/users/orders/:id/reorder', authMiddleware, async (req, res) => {
  try {
    const originalOrder = await Order.findOne({
      _id: req.params.id,
      'customer.user': req.user.id
    }).populate('items.product');

    if (!originalOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Create new order with same items
    const newOrder = new Order({
      customer: {
        user: req.user.id,
        name: originalOrder.customer.name,
        email: originalOrder.customer.email,
        phone: originalOrder.customer.phone
      },
      items: originalOrder.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price
      })),
      status: 'pending',
      orderNumber: generateOrderNumber()
    });

    await newOrder.save();

    res.json({
      success: true,
      message: 'Order recreated successfully',
      data: newOrder
    });
  } catch (error) {
    console.error('Error reordering:', error);
    res.status(500).json({
      success: false,
      message: 'Error recreating order'
    });
  }
});

// Helper function to generate order number
function generateOrderNumber() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp.slice(-6)}-${random}`;
}

module.exports = router; 