import express from 'express';

import userController from '../controllers/users.controller.js';
import auth from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.get("/", userController.index); // read

userRouter.get("/:userId", userController.show); // read
userRouter.post("/", auth.check, auth.admin, userController.store); // create
userRouter.patch(
  "/:userId",
  auth.check,
  auth.admin,
  userController.updateProfile
); // update
userRouter.delete("/:userId", auth.check, auth.admin, userController.destroy); // delete

export default userRouter;
