const sequelize = require('../config/database');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
    const { orderId, userId, items } = req.body;
    
    // Using a managed transaction to ensure ACID compliance
    const transaction = await sequelize.transaction();

    try {
        let totalAmount = 0;
        const itemsToCreate = [];

        for (const item of items) {
            const product = await Product.findByPk(item.productId, { transaction });
            
            if (!product) {
                await transaction.rollback();
                return res.status(404).json({ message: `Product ${item.productId} not found` });
            }

            if (product.stock < item.quantity) {
                await transaction.rollback();
                return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
            }

            // Deduct stock
            product.stock -= item.quantity;
            await product.save({ transaction });

            const itemPrice = parseFloat(product.price);
            totalAmount += itemPrice * item.quantity;

            itemsToCreate.push({
                orderItemId: item.orderItemId,
                orderId: orderId,
                productId: item.productId,
                quantity: item.quantity,
                price: itemPrice
            });
        }

        // Create main Order entry
        const newOrder = await Order.create({
            orderId,
            userId,
            totalAmount,
            status: 'completed'
        }, { transaction });

        // Bulk insert the individual order items
        await OrderItem.bulkCreate(itemsToCreate, { transaction });

        await transaction.commit();
        
        // Fetch full order structure to send back
        const completeOrder = await Order.findByPk(orderId, {
            include: [{ model: OrderItem, as: 'items', include: ['product'] }]
        });

        res.status(201).json(completeOrder);
    } catch (err) {
        await transaction.rollback();
        res.status(500).json({ message: 'Order processing failed', error: err.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [{ model: OrderItem, as: 'items', include: ['product'] }]
        });
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [{ model: OrderItem, as: 'items' }]
        });
        res.json(orders);
    } catch (err) {
        res.status(400).json(err);
    }
};