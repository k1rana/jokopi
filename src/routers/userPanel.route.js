import express from "express";

import userPanelController from "../controllers/userPanel.controller.js";
import auth from "../middlewares/auth.js";

const userPanelRouter = express.Router();

userPanelRouter.get("/profile", auth.check, userPanelController.getUserProfile); // login

export default userPanelRouter;
