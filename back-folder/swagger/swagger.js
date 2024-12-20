import swaggerJSDoc from 'swagger-jsdoc';

// Swagger definition for the API documentation
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'FOC REQUEST TOOL API',
    version: '1.0.0',
    description:
      'Welcome to the FOC TOOL API Documentation. This documentation will help you understand how to use the API.',
  },
  servers: [{ url: `http://localhost:3000/api/` }],
};

const options = {
  swaggerDefinition,
  apis: ['./app/routers/*.js'], // all routes in the routers folder
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
