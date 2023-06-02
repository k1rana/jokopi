import adminModel from "../models/admin.model.js";

const monthlyReport = async (req, res) => {
  try {
    const result = await adminModel.getMonthlyReport();
    res.status(200).json({
      status: 200,
      msg: "Success fetch data",
      data: result.rows,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: 500,
      msg: "Internal server error",
    });
  }
};

const reports = async (req, res) => {
  try {
    const { view } = req.query;
    const result = await adminModel.getReports(view);
    res.status(200).json({
      status: 200,
      msg: "Success fetch data",
      data: result.rows,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: 500,
      msg: "Internal server error",
    });
  }
};

const dailyAverage = async (req, res) => {
  try {
    const result = await adminModel.getDailyAverage();
    res.status(200).json({
      status: 200,
      msg: "Success fetch data",
      data: result.rows,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: 500,
      msg: "Internal server error",
    });
  }
};

export default {
  monthlyReport,
  dailyAverage,
  reports,
};
