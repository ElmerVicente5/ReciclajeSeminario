import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Swagger Express API',
      version: '1.0.0',
      description: 'A simple Express API with Swagger documentation',
    },
  },
  apis: ['./src/routes/route.js', './src/routes/acopio.route.js'],
   // Path to your API routes
};

const specs = swaggerJsdoc(options);

export {
  specs,
  swaggerUi,
};