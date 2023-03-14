import db from '../helpers/postgre.js';
import userModel from '../models/users.model.js';

async function index(req, res) {
  try {
    const meta = await userModel.getMeta(req);
    const page = !isNaN(req.query.page) ? parseInt(req.query.page) : 1;
    if (page < 1 || page > meta.totalPage) {
      res.status(404).json({
        msg: "Invalid page",
      });
      return;
    }
    const result = await userModel.index(req);
    if (result.rows.length === 0) {
      res.status(404).json({
        data: result.rows,
        msg: "User not found",
      });
      return;
    }
    res.status(200).json({
      meta,
      data: result.rows,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

async function store(req, res) {
  const client = await db.connect();
  try {
    (await client).query("BEGIN");
    const createUser = await userModel.storeUser(client, req);
    await userModel.storeProfile(client, createUser.rows[0].id);
    (await client).query("COMMIT");
    res.status(201).json({
      msg: "Create Success",
    });
  } catch (err) {
    (await client).query("ROLLBACK");
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

async function show(req, res) {
  try {
    const result = await userModel.show(req);
    if (result.rows.length === 0) {
      res.status(404).json({
        msg: "Data not found",
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

async function updateProfile(req, res) {
  try {
    const result = await userModel.updateProfile(req);
    if (result.rows.length === 0) {
      res.status(404).json({
        msg: "Data not found",
      });
      return;
    }
    res.status(200).json({
      data: result.rows,
      msg: "Update success",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

async function destroy(req, res) {
  const client = await db.connect();
  try {
    const result = await userModel.show(req);
    if (result.rows.length === 0) {
      res.status(404).json({
        msg: "Data not found",
      });
      return;
    }
    (await client).query("BEGIN");
    await userModel.destroyProfile(client, req.params.userId);
    await userModel.destroyUser(client, req.params.userId);
    (await client).query("COMMIT");
    res.status(200).json({
      data: result.rows,
      msg: "Data was destroyed",
    });
  } catch (err) {
    (await client).query("ROLLBACK");
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

export default {
  index,
  show,
  store,
  updateProfile,
  destroy,
};
