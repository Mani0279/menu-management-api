// routes/itemRoutes.js - Item Routes
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// CREATE - Create a new item
router.post('/', itemController.createItem);

// GET - Get all items
router.get('/', itemController.getAllItems);

// GET - Search items by name
router.get('/search', itemController.searchItemsByName);

// GET - Get all items under a category
router.get('/category/:categoryId', itemController.getItemsByCategory);

// GET - Get all items under a sub-category
router.get('/subcategory/:subCategoryId', itemController.getItemsBySubCategory);

// GET - Get item by ID or name
router.get('/:identifier', itemController.getItemByIdentifier);

// PUT - Update item by ID
router.put('/:id', itemController.updateItem);

// DELETE - Delete item by ID (bonus endpoint)
router.delete('/:id', itemController.deleteItem);

module.exports = router;