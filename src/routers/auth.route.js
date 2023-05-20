import express from 'express';

import authController from '../controllers/auth.controller.js';
import auth from '../middlewares/auth.js';

const authRouter = express.Router();

authRouter.post("/login", authController.login); // login
authRouter.post("/register", authController.register); // register
authRouter.delete("/logout", authController.logout); // logout
authRouter.patch("/editPassword", auth.check, authController.updatePassword); // change password

authRouter.post("/forgotPass", authController.requestResetPass); // change password
authRouter.get("/resetPass", authController.getDataResetPass);
authRouter.patch("/resetPass", authController.resetPassword); // change password

// manage firebase token
authRouter.post("/link-fcm", auth.check, authController.linkFcm);
authRouter.delete("/unlink-fcm", auth.check, authController.unlinkFcm);

export default authRouter;
