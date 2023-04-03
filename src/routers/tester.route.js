import express from "express";

import testController from "../controllers/test.controller.js";
import memoryUpload from "../middlewares/memoryUpload.js";

const testRouter = express.Router();

testRouter.post("/upload", memoryUpload, testController.testUpload); // test upload cloudinary

export default testRouter;
