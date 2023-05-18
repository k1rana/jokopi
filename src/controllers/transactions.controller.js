import db from "../helpers/postgre.js";
import transactionsModel from "../models/transactions.model.js";

async function index(req, res) {
  try {
    const result = await transactionsModel.index(req);
    const transactions = result.rows;
    if (result.rows.length === 0) {
      res.status(404).json({
        data: transactions,
        msg: "History not found",
      });
      return;
    }
    res.status(200).json({
      status: 200,
      msg: "Success get data",
      data: result.rows,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
}

async function store(req, res) {
  const { authInfo, body } = req;

  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const { payment_id, delivery_id } = body;
    const result = await transactionsModel.createTransaction(
      client,
      body,
      authInfo.id
    );
    const transactionId = result.rows[0].id;
    await transactionsModel.createDetailTransaction(
      client,
      body,
      transactionId
    );
    const total = await transactionsModel.grandTotal(client, transactionId);

    const deliveryFee = await client.query(
      `SELECT fee FROM deliveries WHERE id = $1`,
      [delivery_id]
    );
    const paymentFee = await client.query(
      `SELECT fee FROM payments WHERE id = $1`,
      [payment_id]
    );

    const grandTotal =
      Number(total) +
      Number(deliveryFee.rows[0].fee) +
      Number(paymentFee.rows[0].fee);

    await transactionsModel.updateGrandTotal(client, transactionId, grandTotal);

    await client.query("COMMIT");
    client.release();
    res.status(201).json({
      status: 201,
      msg: "Create Transaction Success",
    });
  } catch (err) {
    console.log(err.message);
    await client.query("ROLLBACK");
    client.release();
    res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
}

// params => query (search, filter, sort, paginasi) & path (get detail)
// query => req.query
// path => req.params
async function show(req, res) {
  try {
    const result = await transactionsModel.show(req);
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

// params => query (search, filter, sort, paginasi) & path (get detail)
// query => req.query
// path => req.params
async function update(req, res) {
  try {
    const result = await transactionsModel.update(req);
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
  try {
    const result = await transactionsModel.destroy(req);
    if (result.rows.length === 0) {
      res.status(404).json({
        msg: "Data not found",
      });
      return;
    }
    res.status(200).json({
      data: result.rows,
      msg: "Data was destroyed",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

async function statusDone(req, res) {
  try {
    const { transactions } = req.body;
    const id_array = transactions.split(",").map(function (item) {
      return item.trim();
    });

    const result = await transactionsModel.changeStatusToDone(id_array);

    res.status(200).json({
      status: 200,
      msg: "Fetch data success",
      result: result.rows,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
}

export default {
  index,
  show,
  store,
  update,
  destroy,
  statusDone,
};
