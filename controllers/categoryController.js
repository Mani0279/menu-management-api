// controllers/categoryController.js - Category Controller
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Item = require('../models/Item');

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, image, description, taxApplicability, tax, taxType } = req.body;

    // Validate required fields
    if (!name || !image || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name, image, and description are required'
      });
    }

    // Create new category
    const category = new Category({
      name,
      image,
      description,
      taxApplicability: taxApplicability || false,
      tax: taxApplicability ? (tax || 0) : 0,
      taxType: taxApplicability ? (taxType || 'percentage') : 'none'
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// Get category by ID or name
exports.getCategoryByIdentifier = async (req, res) => {
  try {
    const { identifier } = req.params;
    let category;

    // Check if identifier is a valid MongoDB ObjectId
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(identifier);
    } else {
      // Search by name (case-insensitive)
      category = await Category.findOne({ 
        name: { $regex: new RegExp(`^${identifier}$`, 'i') } 
      });
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find and update category
    const category = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
};

// Delete category (bonus)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has sub-categories or items
    const subCategoryCount = await SubCategory.countDocuments({ category: id });
    const itemCount = await Item.countDocuments({ category: id });

    if (subCategoryCount > 0 || itemCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing sub-categories or items'
      });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
};