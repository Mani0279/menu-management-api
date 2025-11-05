Menu Management API - Node.js Backend
A comprehensive RESTful API for managing restaurant menu hierarchies including categories, sub-categories, and items with tax management capabilities.
📋 Table of Contents
Features
Tech Stack
Prerequisites
Installation
Project Structure
API Documentation
Testing with Postman
Assignment Questions
✨ Features
Category Management: Create, read, update, and delete menu categories
Sub-Category Management: Organize items within categories using sub-categories
Item Management: Full CRUD operations for menu items
Tax Management: Flexible tax configuration at category, sub-category, and item levels
Search Functionality: Search items by name with partial matching
Hierarchical Structure: Category → Sub-Category → Items
Data Validation: Comprehensive input validation and error handling
MongoDB Integration: Efficient data storage with relationships
🛠️ Tech Stack
Runtime: Node.js
Framework: Express.js
Database: MongoDB with Mongoose ODM
Environment Variables: dotenv
📦 Prerequisites
Before running this application, ensure you have the following installed:
Node.js (v14 or higher)
MongoDB (v4.4 or higher) - Running locally or MongoDB Atlas account
npm or yarn package manager
Postman (for API testing)

📁 Project Structure
menu-management-api/
├── controllers/
│   ├── categoryController.js      # Category business logic
│   ├── subCategoryController.js   # Sub-category business logic
│   └── itemController.js          # Item business logic
├── models/
│   ├── Category.js                # Category schema
│   ├── SubCategory.js             # Sub-category schema
│   └── Item.js                    # Item schema
├── routes/
│   ├── categoryRoutes.js          # Category endpoints
│   ├── subCategoryRoutes.js       # Sub-category endpoints
│   └── itemRoutes.js              # Item endpoints
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore file
├── package.json                   # Project dependencies
├── server.js                      # Application entry point
└── README.md                      # Documentation


📝 10-Point Operations Guide
1. Category Creation
Create categories as the top-level menu organization. Each category can have tax settings that cascade to sub-categories and items.
2. Sub-Category Management
Organize items within categories using optional sub-categories. Sub-categories inherit tax settings from parent categories by default.
3. Item Creation
Add menu items under categories or sub-categories. Items automatically calculate total amount (base - discount).
4. Hierarchical Retrieval
Fetch data at any level: all categories, specific category with sub-categories, or items filtered by category/sub-category.
5. Search Functionality
Search items by name using partial matching (case-insensitive) to quickly find menu items.
6. Tax Inheritance
Tax settings flow from category → sub-category → item, but can be overridden at each level.
7. Update Operations
Modify any attribute of categories, sub-categories, or items using PUT requests with partial data.
8. Data Validation
All inputs are validated: required fields, data types, value ranges (e.g., tax 0-100%), and relationship integrity.
9. Cascading Constraints
Prevent deletion of categories/sub-categories that have child records, maintaining data integrity.
10. Flexible Querying
Retrieve records by MongoDB ObjectId or by name, making the API user-friendly and versatile.

1. Which database you have chosen and why?
MongoDB was chosen for this project for several compelling reasons:
-Schema Flexibility
-JSON-like Format:
-Mongoose ODM
2. 3 things that you learned from this assignment?
A. Hierarchical Data Modeling
B. RESTful API Best Practices
C. MongoDB Advanced Features

3. What was the most difficult part of the assignment?
The most challenging aspect was implementing the tax inheritance system with override capabilities while maintaining data consistency.

Challenges faced:

Default Value Logic: Ensuring sub-categories automatically inherit tax settings from categories during creation, but allowing manual override.
Update Scenarios: Handling cases where updating a category's tax should or shouldn't affect existing sub-categories and items.
Data Consistency: When a sub-category's tax is not explicitly set, deciding whether to store the inherited value or fetch it dynamically from parent.
Validation Complexity: Creating validation rules that allow tax to be 0 (valid) but also detect when it's not set (null/undefined) to trigger inheritance.

4. What you would have done differently given more time?
A. Advanced Features:
Bulk Operations
Image Upload
Audit Trail 
Soft Deletes
B.Enhanced Search & Filtering
C. Security & Performance
D. Testing & Documentation