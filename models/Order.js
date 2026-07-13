const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    orderId: {
        type: Sequelize.STRING(36),
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: Sequelize.STRING(36),
        allowNull: false
        // Links to your AppUser module if needed
    },
    totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    status: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'pending' // pending, completed, cancelled
    }
}, {
    tableName: 'orders',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
});

module.exports = Order;