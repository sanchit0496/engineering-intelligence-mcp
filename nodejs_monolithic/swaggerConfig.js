const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Users Service API',
      version: '1.0.0',
      description: 'A Users Microservice API documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  // 🟢 Yeh line change ki hai: Absolute path use kiya hai
  apis: [path.join(__dirname, 'routes/*.js')], 
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerSpec, swaggerUi };