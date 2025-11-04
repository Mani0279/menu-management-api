// models/SubCategory.js - SubCategory Schema
const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sub-category name is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Sub-category image URL is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Sub-category description is required'],
    trim: true
  },
  // Reference to parent category
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Parent category is required']
  },
  taxApplicability: {
    type: Boolean,
    default: function() {
      // This will be set from category during creation
      return false;
    }
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative'],
    max: [100, 'Tax cannot exceed 100%']
  }
}, {
  timestamps: true
});

// Compound index for unique sub-category name within a category
subCategorySchema.index({ name: 1, category: 1 }, { unique: true });

// Index for faster search queries
subCategorySchema.index({ name: 'text' });

module.exports = mongoose.model('SubCategory', subCategorySchema);