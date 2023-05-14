import express from 'express';

import productController from '../controllers/products.controller.js';
import auth from '../middlewares/auth.js';
import memoryUpload from '../middlewares/memoryUpload.js';

const productsRouter = express.Router();

productsRouter.get("/", productController.index); // read
productsRouter.get("/prices", productController.priceSize); // read

productsRouter.get("/:productId", productController.show); // read

productsRouter.post(
  "/",
  auth.check,
  auth.admin,
  memoryUpload,
  productController.store
); // create

productsRouter.patch(
  "/:productId",
  auth.check,
  auth.admin,
  memoryUpload,
  productController.update
); // update

productsRouter.delete(
  "/:productId",
  auth.check,
  auth.admin,
  productController.destroy
); // delete

export default productsRouter;
