import express from "express";

import userPanelController from "../controllers/userPanel.controller.js";
import auth from "../middlewares/auth.js";
import memoryUpload from "../middlewares/memoryUpload.js";

const userPanelRouter = express.Router();

userPanelRouter.get("/profile", auth.check, userPanelController.getUserProfile); // login
userPanelRouter.get("/transactions", auth.check, userPanelController.getTrx); // login

userPanelRouter.get("/cart", auth.check, userPanelController.getCartAll); // login
userPanelRouter.patch("/cart", auth.check, userPanelController.addCart); //

userPanelRouter.patch(
  "/profile",
  auth.check,
  memoryUpload,
  userPanelController.updateProfile
);

export default userPanelRouter;
