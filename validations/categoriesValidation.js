const Joi = require("joi");

const createCategorySchema = Joi.object({
    categoryId: Joi.string().guid({ version: ['uuidv4'] }).required(),
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().allow('', null)
});

module.exports = {
    createCategorySchema,
};