import express from 'express';

import userController from '../controllers/users.controller.js';

const userRouter = express.Router();

userRouter.post('/', userController.store); // create
userRouter.get('/', userController.index); // read

userRouter.get('/:userId', userController.show); // read
userRouter.put('/:userId', userController.updateProfile); // update
userRouter.delete('/:userId', userController.destroy); // delete

export default userRouter;
