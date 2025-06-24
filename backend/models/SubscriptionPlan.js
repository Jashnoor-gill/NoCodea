const mongoose = require('mongoose');

const SubscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
  },
  billingInterval: {
    type: String,
    enum: ['month', 'year'],
    required: true,
    default: 'month',
  },
  features: {
    type: [String],
    default: [],
  },
  stripePlanId: {
    type: String,
    // This will be important for integrating with Stripe later
  },
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active',
  },
}, { timestamps: true });

module.exports = mongoose.model('SubscriptionPlan', SubscriptionPlanSchema); 