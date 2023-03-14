import express from 'express';

import userController from '../controllers/users.controller.js';
import auth from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.post("/", userController.store); // create
userRouter.get("/", userController.index); // read

userRouter.get("/:userId", userController.show); // read
userRouter.patch("/:userId", userController.updateProfile); // update
userRouter.delete("/:userId", auth.check, auth.admin, userController.destroy); // delete

export default userRouter;
