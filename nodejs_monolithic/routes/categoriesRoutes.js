const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');
const { createCategorySchema } = require('../validations/categoriesValidation');

// Middleware for payload validation
const validateCategoryCreation = (req, res, next) => {
    const { error } = createCategorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

// Create a new category
router.post('/', validateCategoryCreation, categoriesController.createCategory);

// Get category by ID
router.get('/:id', categoriesController.getCategoryById);

// Update category by ID
router.put('/:id', categoriesController.updateCategory);

// Delete category by ID
router.delete('/:id', categoriesController.deleteCategory);

// Get all category entries
router.get('/', categoriesController.getAllCategories);

module.exports = router;