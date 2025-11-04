// controllers/itemController.js - Item Controller
const Item = require('../models/Item');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');

// Create a new item
exports.createItem = async (req, res) => {
  try {
    const { 
      name, 
      image, 
      description, 
      taxApplicability, 
      tax, 
      baseAmount, 
      discount, 
      categoryId,
      subCategoryId 
    } = req.body;

    // Validate required fields
    if (!name || !image || !description || !baseAmount || !categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Name, image, description, baseAmount, and categoryId are required'
      });
    }

    // Verify category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // If subCategoryId is provided, verify it exists and belongs to the category
    if (subCategoryId) {
      const subCategory = await SubCategory.findOne({
        _id: subCategoryId,
        category: categoryId
      });

      if (!subCategory) {
        return res.status(404).json({
          success: false,
          message: 'Sub-category not found or does not belong to specified category'
        });
      }
    }

    // Calculate total amount
    const discountAmount = discount || 0;
    const totalAmount = baseAmount - discountAmount;

    // Create new item
    const item = new Item({
      name,
      image,
      description,
      taxApplicability: taxApplicability || false,
      tax: taxApplicability ? (tax || 0) : 0,
      baseAmount,
      discount: discountAmount,
      totalAmount,
      category: categoryId,
      subCategory: subCategoryId || null
    });

    await item.save();

    // Populate references in response
    await item.populate([
      { path: 'category', select: 'name' },
      { path: 'subCategory', select: 'name' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating item',
      error: error.message
    });
  }
};

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate('category', 'name image')
      .populate('subCategory', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching items',
      error: error.message
    });
  }
};

// Get all items under a category
exports.getItemsByCategory = async (req, res) => {
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

    const items = await Item.find({ category: categoryId })
      .populate('category', 'name image')
      .populate('subCategory', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      category: category.name,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching items',
      error: error.message
    });
  }
};

// Get all items under a sub-category
exports.getItemsBySubCategory = async (req, res) => {
  try {
    const { subCategoryId } = req.params;

    // Verify sub-category exists
    const subCategory = await SubCategory.findById(subCategoryId)
      .populate('category', 'name');
    
    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: 'Sub-category not found'
      });
    }

    const items = await Item.find({ subCategory: subCategoryId })
      .populate('category', 'name image')
      .populate('subCategory', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      category: subCategory.category.name,
      subCategory: subCategory.name,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching items',
      error: error.message
    });
  }
};

// Get item by ID or name
exports.getItemByIdentifier = async (req, res) => {
  try {
    const { identifier } = req.params;
    let item;

    // Check if identifier is a valid MongoDB ObjectId
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      item = await Item.findById(identifier)
        .populate('category', 'name image description')
        .populate('subCategory', 'name description');
    } else {
      // Search by name (case-insensitive)
      item = await Item.findOne({ 
        name: { $regex: new RegExp(`^${identifier}$`, 'i') } 
      })
        .populate('category', 'name image description')
        .populate('subCategory', 'name description');
    }

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching item',
      error: error.message
    });
  }
};

// Search items by name
exports.searchItemsByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Search query parameter "name" is required'
      });
    }

    // Search items using text index or regex for partial matches
    const items = await Item.find({
      name: { $regex: name, $options: 'i' }
    })
      .populate('category', 'name image')
      .populate('subCategory', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      searchQuery: name,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching items',
      error: error.message
    });
  }
};

// Update item
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If categoryId is being updated, verify it exists
    if (updateData.categoryId) {
      const category = await Category.findById(updateData.categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      updateData.category = updateData.categoryId;
      delete updateData.categoryId;
    }

    // If subCategoryId is being updated, verify it exists
    if (updateData.subCategoryId) {
      const subCategory = await SubCategory.findById(updateData.subCategoryId);
      if (!subCategory) {
        return res.status(404).json({
          success: false,
          message: 'Sub-category not found'
        });
      }
      updateData.subCategory = updateData.subCategoryId;
      delete updateData.subCategoryId;
    }

    // Recalculate total amount if baseAmount or discount is updated
    if (updateData.baseAmount !== undefined || updateData.discount !== undefined) {
      const item = await Item.findById(id);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Item not found'
        });
      }
      
      const baseAmount = updateData.baseAmount !== undefined ? updateData.baseAmount : item.baseAmount;
      const discount = updateData.discount !== undefined ? updateData.discount : item.discount;
      updateData.totalAmount = baseAmount - discount;
    }

    const item = await Item.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('category', 'name image')
      .populate('subCategory', 'name');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating item',
      error: error.message
    });
  }
};

// Delete item (bonus)
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting item',
      error: error.message
    });
  }
};