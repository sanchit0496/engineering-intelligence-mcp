const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.getCategoryById = async (req, res) => {
    const categoryId = req.params.id;
    try {
        const category = await Category.findByPk(categoryId);
        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

exports.updateCategory = async (req, res) => {
    const categoryId = req.params.id;
    try {
        const [updated] = await Category.update(req.body, { where: { categoryId: categoryId } });
        if (updated) {
            const updatedCategory = await Category.findByPk(categoryId);
            res.status(200).json(updatedCategory);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(400).json(error);
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const numberDestroyed = await Category.destroy({ where: { categoryId: req.params.id } });
        if (numberDestroyed) {
            res.status(200).json({ message: 'Category deleted successfully' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (err) {
        res.status(400).json(err);
    }
};