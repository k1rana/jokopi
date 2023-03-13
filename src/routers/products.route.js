import express from 'express';

import productController from '../controllers/products.controller.js';
import auth from '../middlewares/auth.js';
import { singleUpload } from '../middlewares/imageUpload.js';

const productsRouter = express.Router();

productsRouter.get("/", productController.index); // read

productsRouter.get("/:productId", productController.show); // read

productsRouter.post(
  "/",
  auth.check,
  auth.admin,
  singleUpload("image"),
  productController.store
); // create

productsRouter.patch(
  "/:productId",
  auth.check,
  auth.admin,
  singleUpload("image"),
  productController.update
); // update

productsRouter.delete(
  "/:productId",
  auth.check,
  auth.admin,
  productController.destroy
); // delete

export default productsRouter;
