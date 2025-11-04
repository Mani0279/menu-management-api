// routes/categoryRoutes.js - Category Routes
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// CREATE - Create a new category
router.post('/', categoryController.createCategory);

// GET - Get all categories
router.get('/', categoryController.getAllCategories);

// GET - Get category by ID or name
router.get('/:identifier', categoryController.getCategoryByIdentifier);

// PUT - Update category by ID
router.put('/:id', categoryController.updateCategory);

// DELETE - Delete category by ID (bonus endpoint)
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;