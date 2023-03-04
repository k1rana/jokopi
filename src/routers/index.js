import express from 'express';

// route files
import productsRouter from './products.route.js';

// routes from express
const routers = express.Router();

routers.use('/products', productsRouter); // products

export default routers;
