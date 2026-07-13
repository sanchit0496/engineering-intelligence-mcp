const Joi = require("joi");

const createOrderSchema = Joi.object({
    orderId: Joi.string().guid({ version: ['uuidv4'] }).required(),
    userId: Joi.string().guid({ version: ['uuidv4'] }).required(),
    items: Joi.array().items(
        Joi.object({
            orderItemId: Joi.string().guid({ version: ['uuidv4'] }).required(),
            productId: Joi.string().guid({ version: ['uuidv4'] }).required(),
            quantity: Joi.number().integer().positive().required()
        })
    ).min(1).required()
});

module.exports = {
    createOrderSchema,
};