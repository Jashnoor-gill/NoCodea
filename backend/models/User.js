const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { AddressSchema } = require('./Address');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [function() { return !this.googleId; }, 'Password is required for email registration'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String
  },
  emailVerificationExpires: {
    type: Date
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'dark'
    },
    language: {
      type: String,
      default: 'en'
    },
    currency: {
      type: String,
      default: 'USD'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  },
  stats: {
    projectsCreated: {
      type: Number,
      default: 0
    },
    templatesUsed: {
      type: Number,
      default: 0
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  },
  addresses: [AddressSchema],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  compare: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ status: 1 });
userSchema.index({ role: 1 });
userSchema.index({ resetPasswordToken: 1 });
userSchema.index({ emailVerificationToken: 1 });

// Virtual for checking if account is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get user profile (without sensitive data)
userSchema.methods.getProfile = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    role: this.role,
    status: this.status,
    emailVerified: this.emailVerified,
    lastLogin: this.lastLogin,
    preferences: this.preferences,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Update last active
userSchema.methods.updateLastActive = function() {
  this.stats.lastActive = new Date();
  return this.save();
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to increment login attempts
userSchema.statics.incLoginAttempts = async function(email) {
  const user = await this.findOne({ email });
  if (user) {
    user.loginAttempts += 1;
    
    // Lock account after 5 failed attempts for 1 hour
    if (user.loginAttempts >= 5) {
      user.lockUntil = Date.now() + 60 * 60 * 1000; // 1 hour
    }
    
    await user.save();
  }
  return user;
};

// Static method to reset login attempts
userSchema.statics.resetLoginAttempts = async function(email) {
  return this.findOneAndUpdate(
    { email },
    { 
      loginAttempts: 0,
      lockUntil: undefined,
      lastLogin: new Date()
    }
  );
};

module.exports = mongoose.model('User', userSchema); 