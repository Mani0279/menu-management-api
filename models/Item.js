    // models/Item.js - Item Schema
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Item image URL is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Item description is required'],
    trim: true
  },
  taxApplicability: {
    type: Boolean,
    required: true,
    default: false
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative']
  },
  baseAmount: {
    type: Number,
    required: [true, 'Base amount is required'],
    min: [0, 'Base amount cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  totalAmount: {
    type: Number,
    required: true
  },
  // Reference to parent category (required)
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Parent category is required']
  },
  // Reference to parent sub-category (optional)
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    default: null
  }
}, {
  timestamps: true
});

// Calculate total amount before saving
itemSchema.pre('save', function(next) {
  this.totalAmount = this.baseAmount - this.discount;
  next();
});

// Index for faster search queries
itemSchema.index({ name: 'text', description: 'text' });

// Compound index for category and subcategory queries
itemSchema.index({ category: 1, subCategory: 1 });

module.exports = mongoose.model('Item', itemSchema);