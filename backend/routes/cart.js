const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const authMiddleware = require('../middleware/auth');
const paymentService = require('../services/paymentService');
const shippingService = require('../services/shippingService');

// All routes here are for the logged-in user
router.use(authMiddleware);

// @route   GET api/cart
// @desc    Get user's shopping cart with payment and shipping options
// @access  Private
router.get('/', async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id }).populate('items.product').populate('coupon');
        if (!cart) {
            cart = await Cart.create({ user: req.user.id });
        }

        // Calculate totals
        const subtotal = cart.items.reduce((acc, item) => acc + (item.product.basePrice * item.quantity), 0);
        let discount = 0;
        if (cart.coupon) {
            if (cart.coupon.discountType === 'percentage') {
                discount = subtotal * (cart.coupon.discountValue / 100);
            } else {
                discount = cart.coupon.discountValue;
            }
        }
        const grandTotal = subtotal - discount;
        
        const cartData = {
            ...cart.toObject(),
            totals: {
                subtotal: subtotal.toFixed(2),
                discount: discount.toFixed(2),
                grandTotal: grandTotal.toFixed(2)
            },
            paymentMethods: paymentService.getAvailableMethods(),
            shippingMethods: shippingService.getAvailableMethods()
        };

        res.json(cartData);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/cart/items
// @desc    Add or update an item in the cart
// @access  Private
router.post('/items', async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
        } else {
            cart.items.push({ product: productId, quantity, price: product.basePrice });
        }
        
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/cart/items/:productId
// @desc    Remove an item from the cart
// @access  Private
router.delete('/items/:productId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        cart.items = cart.items.filter(({ product }) => product.toString() !== req.params.productId);
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


// @route   POST api/cart/coupon
// @desc    Apply a coupon to the cart
// @access  Private
router.post('/coupon', async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code, isActive: true });
        if (!coupon) return res.status(404).json({ msg: 'Coupon not found or is inactive' });

        const cart = await Cart.findOne({ user: req.user.id });
        cart.coupon = coupon._id;
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/cart/coupon
// @desc    Remove coupon from the cart
// @access  Private
router.delete('/coupon', authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        cart.coupon = null;
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


module.exports = router; 