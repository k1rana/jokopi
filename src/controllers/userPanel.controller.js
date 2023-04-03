import userPanelModel from '../models/userPanel.model.js';

async function getUserProfile(req, res) {
  try {
    const { id } = req.authInfo;
    const result = await userPanelModel.getUserProfile(id);
    if (result.rows.length === 0) {
      res.status(404).json({
        data: result.rows,
        msg: "User not found",
      });
      return;
    }
    res.status(200).json({
      data: result.rows,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

export default { getUserProfile };
