// controllers/subCategoryController.js - SubCategory Controller
const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');
const Item = require('../models/Item');

// Create a new sub-category
exports.createSubCategory = async (req, res) => {
  try {
    const { name, image, description, categoryId, taxApplicability, tax } = req.body;

    // Validate required fields
    if (!name || !image || !description || !categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Name, image, description, and categoryId are required'
      });
    }

    // Check if parent category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Parent category not found'
      });
    }

    // Use category's tax settings as default if not provided
    const subCategory = new SubCategory({
      name,
      image,
      description,
      category: categoryId,
      taxApplicability: taxApplicability !== undefined ? taxApplicability : category.taxApplicability,
      tax: tax !== undefined ? tax : category.tax
    });

    await subCategory.save();

    // Populate category details in response
    await subCategory.populate('category', 'name');

    res.status(201).json({
      success: true,
      message: 'Sub-category created successfully',
      data: subCategory
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Sub-category with this name already exists in this category'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating sub-category',
      error: error.message
    });
  }
};

// Get all sub-categories
exports.getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find()
      .populate('category', 'name image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subCategories.length,
      data: subCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sub-categories',
      error: error.message
    });
  }
};

// Get all sub-categories under a specific category
exports.getSubCategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Verify category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const subCategories = await SubCategory.find({ category: categoryId })
      .populate('category', 'name image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      category: category.name,
      count: subCategories.length,
      data: subCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sub-categories',
      error: error.message
    });
  }
};

// Get sub-category by ID or name
exports.getSubCategoryByIdentifier = async (req, res) => {
  try {
    const { identifier } = req.params;
    let subCategory;

    // Check if identifier is a valid MongoDB ObjectId
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      subCategory = await SubCategory.findById(identifier)
        .populate('category', 'name image description');
    } else {
      // Search by name (case-insensitive)
      subCategory = await SubCategory.findOne({ 
        name: { $regex: new RegExp(`^${identifier}$`, 'i') } 
      }).populate('category', 'name image description');
    }

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: 'Sub-category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: subCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sub-category',
      error: error.message
    });
  }
};

// Update sub-category
exports.updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If categoryId is being updated, verify the new category exists
    if (updateData.categoryId) {
      const category = await Category.findById(updateData.categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'New parent category not found'
        });
      }
      updateData.category = updateData.categoryId;
      delete updateData.categoryId;
    }

    const subCategory = await SubCategory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name image');

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: 'Sub-category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Sub-category updated successfully',
      data: subCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating sub-category',
      error: error.message
    });
  }
};

// Delete sub-category (bonus)
exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if sub-category has items
    const itemCount = await Item.countDocuments({ subCategory: id });

    if (itemCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete sub-category with existing items'
      });
    }

    const subCategory = await SubCategory.findByIdAndDelete(id);

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: 'Sub-category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Sub-category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting sub-category',
      error: error.message
    });
  }
};