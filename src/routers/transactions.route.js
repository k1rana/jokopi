import express from 'express';

import transactionsController from '../controllers/transactions.controller.js';
import auth from '../middlewares/auth.js';

const transactionsRouter = express.Router();

transactionsRouter.post("/", auth.check, transactionsController.store); // create
transactionsRouter.get(
  "/",
  auth.check,
  auth.admin,
  transactionsController.index
); // read

transactionsRouter.get("/:transactionsId", transactionsController.show); // read
transactionsRouter.patch(
  "/changeStatus",
  auth.check,
  auth.admin,
  transactionsController.statusDone
); // change status
// transactionsRouter.patch("/:transactionsId", transactionsController.update); // update
// transactionsRouter.delete("/:transactionsId", transactionsController.destroy); // delete

export default transactionsRouter;
