const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const { createProductSchema } = require('../validations/productsValidation');

// Middleware for validation
const validateProductCreation = (req, res, next) => {
    const { error } = createProductSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

router.post('/', validateProductCreation, productsController.createProduct);
router.get('/:id', productsController.getProductById);
router.put('/:id', productsController.updateProduct);
router.delete('/:id', productsController.deleteProduct);
router.get('/', productsController.getAllProducts);

module.exports = router;