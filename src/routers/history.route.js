import express from 'express';

import historyController from '../controllers/history.controller.js';

const historyRouter = express.Router();

historyRouter.post('/', historyController.store); // create
historyRouter.get('/', historyController.index); // read

historyRouter.get('/:historyId', historyController.show); // read
historyRouter.put('/:historyId', historyController.update); // update
historyRouter.delete('/:historyId', historyController.destroy); // delete

export default historyRouter;
