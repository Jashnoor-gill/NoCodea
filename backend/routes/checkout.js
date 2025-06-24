const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Import Models
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Country = require('../models/Country');
const Region = require('../models/Region');

// Import Middleware & Services
const authMiddleware = require('../middleware/auth');
const paymentService = require('../services/paymentService');
const shippingService = require('../services/shippingService');
const emailService = require('../services/emailService');

// @route   GET api/checkout/countries
// @desc    Get all active countries
// @access  Public
router.get('/countries', async (req, res) => {
    try {
        const countries = await Country.find({ status: true }).sort({ name: 1 });
        res.json(countries);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET api/checkout/regions
// @desc    Get all active regions for a country
// @access  Public
router.get('/regions', async (req, res) => {
    try {
        const { countryId } = req.query;
        if (!countryId) {
            return res.status(400).json({ msg: 'Country ID is required' });
        }
        const regions = await Region.find({ country: countryId, status: true }).sort({ name: 1 });
        res.json(regions);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/checkout
// @desc    Process customer checkout
// @access  Private (for logged-in users)
router.post(
    '/',
    authMiddleware, // Ensures user is logged in
    [
        // Validation rules
        body('customerEmail', 'Please include a valid email').isEmail(),
        body('billingAddress', 'Billing address is required').notEmpty(),
        body('shippingAddress', 'Shipping address is required').notEmpty(),
        body('paymentMethod', 'Payment method is required').notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const userId = req.user.id;
            const cart = await Cart.findOne({ user: userId }).populate('items.product').populate('coupon');

            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ msg: 'Your cart is empty' });
            }

            // --- Calculate Totals ---
            const subtotal = cart.items.reduce((acc, item) => acc + (item.product.basePrice * item.quantity), 0);
            let discount = 0;
            if (cart.coupon) {
                discount = cart.coupon.discountType === 'percentage' 
                    ? subtotal * (cart.coupon.discountValue / 100)
                    : cart.coupon.discountValue;
            }
            const shippingCost = shippingService.calculateShipping(req.body.shippingAddress);
            const grandTotal = subtotal - discount + shippingCost;
            
            // --- Process Payment ---
            const paymentResult = await paymentService.processPayment({
                amount: grandTotal,
                paymentMethod: req.body.paymentMethod,
                cardDetails: req.body.cardDetails // Assuming card details are passed
            });

            if (!paymentResult.success) {
                return res.status(400).json({ msg: 'Payment failed', details: paymentResult.error });
            }

            // --- Create Order ---
            const order = new Order({
                user: userId,
                customerEmail: req.body.customerEmail,
                items: cart.items.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.product.basePrice
                })),
                totals: { subtotal, discount, shipping: shippingCost, grandTotal },
                billingAddress: req.body.billingAddress,
                shippingAddress: req.body.shippingAddress,
                paymentMethod: req.body.paymentMethod,
                paymentData: paymentResult.data,
                shippingMethod: req.body.shippingMethod,
                orderStatus: 'Processing',
                coupon: cart.coupon ? cart.coupon._id : null
            });

            await order.save();

            // --- Post-Order Actions ---
            // Clear the cart
            cart.items = [];
            cart.coupon = null;
            await cart.save();
            
            // Send order confirmation email
            try {
                const user = await User.findById(userId);
                const populatedOrder = await Order.findById(order._id)
                    .populate('items.product', 'name price')
                    .populate('user', 'name email');
                
                await emailService.sendOrderConfirmation(populatedOrder, user);
            } catch (emailError) {
                console.error('Order confirmation email error:', emailError);
                // Don't fail checkout if email fails
            }

            res.json({ msg: 'Checkout successful', orderId: order._id });

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router; 