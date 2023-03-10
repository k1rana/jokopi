import express from 'express';

import hashMakerController from '../controllers/hashMaker.controller.js';

const hashMakerRouter = express.Router();

hashMakerRouter.post('/', hashMakerController.generate); // create
export default hashMakerRouter;