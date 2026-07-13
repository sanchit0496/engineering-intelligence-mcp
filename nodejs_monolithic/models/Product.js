const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category'); // Importing the Category model for FK reference

const Product = sequelize.define('Product', {
    productId: {
        type: Sequelize.STRING(36),
        allowNull: false,
        primaryKey: true
    },
    categoryId: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
            model: Category,
            key: 'categoryId'
        }
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true
    }
}, {
    tableName: 'products',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
});

module.exports = Product;