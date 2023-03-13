import express from 'express';

import transactionsController from '../controllers/transactions.controller.js';

const transactionsRouter = express.Router();

transactionsRouter.post("/", transactionsController.store); // create
transactionsRouter.get("/", transactionsController.index); // read

transactionsRouter.get("/:transactionsId", transactionsController.show); // read
transactionsRouter.patch("/:transactionsId", transactionsController.update); // update
transactionsRouter.delete("/:transactionsId", transactionsController.destroy); // delete

export default transactionsRouter;
