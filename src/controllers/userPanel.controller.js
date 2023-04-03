import db from '../helpers/postgre.js';
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

async function addCart(req, res) {
  const client = await db.connect();
  const { id } = req.authInfo;
  const { product_id, cart } = req.body;

  try {
    await client.query("BEGIN");

    // check if product with same size already exists in cart
    for (const item of cart) {
      const res = await client.query(
        "SELECT * FROM carts WHERE product_id=$1 AND size_id=$2 AND user_id=$3",
        [product_id, item.size, id]
      );
      if (res.rows.length > 0) {
        // update the existing row with new count
        await client.query(
          "UPDATE carts SET count=$1 WHERE product_id=$2 AND size_id=$3 AND user_id=$4",
          [res.rows[0].count + item.count, product_id, item.size, id]
        );
      } else {
        // create a new row
        await client.query(
          "INSERT INTO carts (product_id, size_id, count, user_id) VALUES ($1, $2, $3, $4)",
          [product_id, item.size, item.count, id]
        );
      }
    }

    await client.query("COMMIT");
    res.status(201).json({
      msg: "Add to cart successful",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

export default { getUserProfile, addCart };
