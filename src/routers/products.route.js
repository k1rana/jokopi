import express from 'express';

import productController from '../controllers/products.controller.js';

const productsRouter = express.Router();

productsRouter.post('/', productController.store); // create
productsRouter.get('/', productController.index); // read

productsRouter.get('/:productId', productController.show); // read
productsRouter.put('/:productId', productController.update); // update
productsRouter.delete('/:productId', productController.destroy); // delete

export default productsRouter;
