import notification from '../helpers/notification.js';
import db from '../helpers/postgre.js';
import fcmModel from '../models/fcm.model.js';
import transactionsModel from '../models/transactions.model.js';

async function index(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * perPage;
    console.log(page, perPage, offset);

    const { status_id } = req.query;

    const meta = await transactionsModel.getMetaTransactions(
      { status_id },
      perPage,
      page
    );
    const result = await transactionsModel.getTransactions(
      { status_id },
      perPage,
      offset
    );
    res.status(200).json({
      status: 200,
      msg: "Fetch success",
      meta,
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

    const result_token = await fcmModel.getAdminTokenFcm();
    if (result_token.rows.length > 0) {
      const tokens = result_token.rows.map((obj) => obj.token);
      console.log(tokens);
      // remote notification
      await notification.send(tokens, {
        title: "New Order Received!",
        body: "Hey dude! new order received, check it out!",
      });
    }
    // await client.query("ROLLBACK");

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

    const ids = result.rows.map((item) => item.user_id);

    const result_token = await fcmModel.getTokenFcmByUserId(ids);
    if (result_token.rows.length > 0) {
      const tokens = result_token.rows.map((obj) => obj.token);
      // remote notification
      await notification.send(tokens, {
        title: "Your order has been processed!",
        body: "Hey coffeeholic, your order has been has been successfully processed! Check it out :)",
      });
    }

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
