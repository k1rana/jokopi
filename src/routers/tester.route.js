import express from "express";

import testController from "../controllers/test.controller.js";
import sendForgotPass from "../helpers/forgotpass.js";
import notification from "../helpers/notification.js";
import memoryUpload from "../middlewares/memoryUpload.js";

const testRouter = express.Router();

testRouter.post("/upload", memoryUpload, testController.testUpload); // test upload cloudinary
testRouter.post("/fcm", async (req, res) => {
  try {
    const { fcm, body, title } = req.body;
    const result = await notification.send(fcm, { body, title });
    console.log(result);
    if (!result) {
      res.status(400).json({
        status: 400,
        msg: "Error while notify",
      });
      return;
    }
    res.status(200).json({
      status: 200,
      msg: "Success notified",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
});
testRouter.post("/email", async (req, res) => {
  try {
    await sendForgotPass({
      to: "tewaje3539@ratedane.com",
      url: "https://jokopi.vercel.app",
    });

    res.status(200).json({
      status: 200,
      msg: "Success send email",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
});

export default testRouter;
