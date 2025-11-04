// routes/subCategoryRoutes.js - SubCategory Routes
const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');

// CREATE - Create a new sub-category under a category
router.post('/', subCategoryController.createSubCategory);

// GET - Get all sub-categories
router.get('/', subCategoryController.getAllSubCategories);

// GET - Get all sub-categories under a specific category
router.get('/category/:categoryId', subCategoryController.getSubCategoriesByCategory);

// GET - Get sub-category by ID or name
router.get('/:identifier', subCategoryController.getSubCategoryByIdentifier);

// PUT - Update sub-category by ID
router.put('/:id', subCategoryController.updateSubCategory);

// DELETE - Delete sub-category by ID (bonus endpoint)
router.delete('/:id', subCategoryController.deleteSubCategory);

module.exports = router;