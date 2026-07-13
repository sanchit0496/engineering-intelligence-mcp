const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const { createOrderSchema } = require('../validations/ordersValidation');

const validateOrderCreation = (req, res, next) => {
    const { error } = createOrderSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

router.post('/', validateOrderCreation, ordersController.createOrder);
router.get('/:id', ordersController.getOrderById);
router.get('/', ordersController.getAllOrders);

module.exports = router;