const Joi = require("joi");

const createProductSchema = Joi.object({
    productId: Joi.string().guid({ version: ['uuidv4'] }).required(),
    categoryId: Joi.string().guid({ version: ['uuidv4'] }).required(),
    name: Joi.string().min(3).max(255).required(),
    price: Joi.number().positive().required(),
    stock: Joi.number().integer().min(0).required(),
    description: Joi.string().allow('', null)
});

module.exports = {
    createProductSchema,
};