import express from 'express';

import authController from '../controllers/auth.controller.js';
import auth from '../middlewares/auth.js';

const authRouter = express.Router();

authRouter.post("/login", authController.login); // login
authRouter.post("/register", authController.register); // register
authRouter.get("/logout", auth.check, authController.logout); // logout
authRouter.patch("/editPassword", auth.check, authController.updatePassword); // change password

authRouter.post("/forgotPass", authController.requestResetPass); // change password
authRouter.patch("/resetPass", authController.resetPassword); // change password

export default authRouter;
