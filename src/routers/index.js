import express from 'express';

// route files
import productsRouter from './products.route.js';
import userRouter from './users.route.js';
import promoRouter from './promo.route.js';
import historyRouter from './history.route.js';
import hashMakerRouter from './hashMaker.route.js';

// routes from express
const routers = express.Router();

routers.use('/products', productsRouter); // products
routers.use('/users', userRouter); // users
routers.use('/promo', promoRouter); // users
routers.use('/history', historyRouter); // users

routers.use('/apiv1/hashmaker', hashMakerRouter);

export default routers;
