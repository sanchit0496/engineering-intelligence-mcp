const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
    categoryId: {
        type: Sequelize.STRING(36),
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true
    }
}, {
    tableName: 'categories',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
});

module.exports = Category;