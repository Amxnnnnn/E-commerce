import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = ['./src/routes/userRoutes.ts', './src/routes/bookRoutes.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the root file where the route starts, such as index.ts, app.ts, routes.ts, etc ... */

swaggerAutogen()(outputFile, routes, doc);