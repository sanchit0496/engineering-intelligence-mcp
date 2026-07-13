const express = require('express');
const app = express();
const logger = require("./logger"); // Make sure the path is correct
const userRoutes = require('./routes/appUserRoutes');

// Import the new module routes
const categoriesRoutes = require('./routes/categoriesRoutes');
const productsRoutes = require('./routes/productsRoutes');
const ordersRoutes = require('./routes/ordersRoutes');

const { swaggerSpec, swaggerUi } = require('./swaggerConfig'); // Adjust the path if necessary

app.use(express.json()); // For parsing application/json

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {    
    // Log the request method and URL
    logger.info(`Incoming request: ${req.method} ${req.url} Body: ${JSON.stringify(req.body)}`);
    next();
});

// Existing application routes
app.use('/appusers', userRoutes);

// Newly integrated E-commerce module routes
app.use('/categories', categoriesRoutes);
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

module.exports = app;