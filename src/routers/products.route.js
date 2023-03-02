import { Router } from "express";

import { getProducts, getProductDetail, insertProducts } from "../controllers/products.controller";

const productsRouter = Router();

productsRouter.post("/", insertProducts); // create
productsRouter.get("/", getProducts); // read
// productsRouter.get("/:productId", getProductDetail); // update
productsRouter.get("/:productId", getProductDetail); // read

export default productsRouter;