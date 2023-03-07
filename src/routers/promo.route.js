import express from 'express';

import promoController from '../controllers/promo.controller.js';

const promoRouter = express.Router();

promoRouter.post('/', promoController.store); // create
promoRouter.get('/', promoController.index); // read

promoRouter.get('/:promoId', promoController.show); // read
promoRouter.patch('/:promoId', promoController.update); // update
promoRouter.delete('/:promoId', promoController.destroy); // delete

export default promoRouter;
