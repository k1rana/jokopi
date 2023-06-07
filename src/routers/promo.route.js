import express from "express";

import promoController from "../controllers/promo.controller.js";
import auth from "../middlewares/auth.js";
import memoryUpload from "../middlewares/memoryUpload.js";

const promoRouter = express.Router();

promoRouter.post(
  "/",
  auth.check,
  auth.admin,
  memoryUpload,
  promoController.store
); // create
promoRouter.get("/", promoController.index); // read
promoRouter.get("/check", promoController.checkCode); // read

promoRouter.get("/:promoId", promoController.show); // read
promoRouter.patch(
  "/:promoId",
  auth.check,
  auth.admin,
  memoryUpload,
  promoController.update
); // update
promoRouter.delete(
  "/:promoId",
  auth.check,
  auth.admin,
  promoController.destroy
); // delete

export default promoRouter;
