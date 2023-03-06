import express from 'express';

import userController from '../controllers/users.controller.js';

const userRouter = express.Router();

userRouter.post('/', userController.store); // create
userRouter.get('/', userController.index); // read

userRouter.get('/:userId', userController.show); // read
// productsRouter.put('/:productId', productController.update); // update
// productsRouter.delete('/:productId', productController.destroy); // delete

export default userRouter;
