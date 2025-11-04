// models/Category.js - Category Schema
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true
  },
  image: {
    type: String,
    required: [true, 'Category image URL is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Category description is required'],
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
    min: [0, 'Tax cannot be negative'],
    max: [100, 'Tax cannot exceed 100%']
  },
  taxType: {
    type: String,
    enum: ['percentage', 'fixed', 'none'],
    default: 'none'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for faster search queries
categorySchema.index({ name: 'text' });

module.exports = mongoose.model('Category', categorySchema);