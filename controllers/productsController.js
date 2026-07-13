const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.getProductById = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findByPk(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

exports.updateProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        const [updated] = await Product.update(req.body, { where: { productId: productId } });
        if (updated) {
            const updatedProduct = await Product.findByPk(productId);
            res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json(error);
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const numberDestroyed = await Product.destroy({ where: { productId: req.params.id } });
        if (numberDestroyed) {
            res.status(200).json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (err) {
        res.status(400).json(err);
    }
};