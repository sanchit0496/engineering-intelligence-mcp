const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./Order');
const Product = require('./Product');

const OrderItem = sequelize.define('OrderItem', {
    orderItemId: {
        type: Sequelize.STRING(36),
        allowNull: false,
        primaryKey: true
    },
    orderId: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
            model: Order,
            key: 'orderId'
        }
    },
    productId: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
            model: Product,
            key: 'productId'
        }
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'order_items',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
});

// Setting up relationships
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = OrderItem;