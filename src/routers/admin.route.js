import express from "express";

import adminController from "../controllers/admin.controller.js";
import auth from "../middlewares/auth.js";

const adminRouter = express.Router();

adminRouter.get(
  "/monthlyReport",
  auth.check,
  auth.admin,
  adminController.monthlyReport
); // monthly report

adminRouter.get(
  "/dailyAverage",
  auth.check,
  auth.admin,
  adminController.dailyAverage
); // daily average

adminRouter.get("/reports", auth.check, auth.admin, adminController.reports); // report by month, daily, weekly
export default adminRouter;
