import { Router } from "express";

import productsRouter from "./products.route";
// routes
const routers = Router();
// Router.use("/", productsRouter);

Router.use("/products", productsRouter); // products

export default routers;