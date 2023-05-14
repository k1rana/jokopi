import uploader from "../helpers/cloudinary.js";
import db from "../helpers/postgre.js";
import cartModel from "../models/cart.model.js";
import transactionsModel from "../models/transactions.model.js";
import userPanelModel from "../models/userPanel.model.js";

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

async function getCartAll(req, res) {
  try {
    const { id } = req.authInfo;

    const result = await cartModel.getCartByUser(id);
    res.status(200).json({
      data: result.rows,
      msg: "Fetch success",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      msg: "Fetch error",
    });
  }
}

async function updateProfile(req, res) {
  const client = await db.connect();
  const {
    display_name,
    first_name,
    last_name,
    phone_number,
    address,
    birthdate,
    email,
    gender,
  } = req.body;
  const { id } = req.authInfo;
  const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const regexPhone =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g;

  if (email && !email.match(regexEmail))
    return res.status(422).json({ msg: "Invalid email input" });
  if (phone_number && !phone_number.match(regexPhone))
    return res.status(422).json({ msg: "Invalid phone numbers" });
  try {
    await client.query("BEGIN");
    const result = await userPanelModel.getUserProfile(id);

    const upload = await uploader(req, "profile", id);

    const sql_profile = `
    UPDATE user_profile SET 
    display_name = $1,
    first_name = $2, 
    last_name = $3,  
    address = $4, 
    birthdate = $5, 
    gender = $6,
    img = $7
    WHERE user_id = $8 RETURNING *`;
    const values_profile = [
      display_name || result.rows[0].display_name,
      first_name || result.rows[0].first_name,
      last_name || result.rows[0].last_name,
      address || result.rows[0].address,
      birthdate || result.rows[0].birthdate,
      gender || result.rows[0].gender,
      upload.data?.secure_url || result.rows[0].img,
      id,
    ];
    await client.query(sql_profile, values_profile);

    const sql_user = `
    UPDATE users SET 
    email = $1,
    phone_number = $2
    WHERE id = $3 RETURNING *`;
    const values_user = [
      email || result.rows[0].email,
      phone_number || result.rows[0].phone_number,
      id,
    ];
    await client.query(sql_user, values_user);

    client.query("COMMIT");
    res.status(200).json({
      status: 200,
      msg: "Success update data",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      msg: "Update error",
    });
  }
}

async function getTrx(req, res) {
  const { id } = req.authInfo;
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * perPage;
    console.log(page, perPage, offset);

    const meta = await transactionsModel.getMetaTransactionByUserId(
      id,
      perPage,
      page
    );
    const result = await transactionsModel.getTransactionByUserId(
      id,
      perPage,
      offset
    );
    res.status(200).json({
      status: 200,
      msg: "Fetch success",
      meta,
      data: result.rows,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      msg: "Fetch error",
    });
  }
}

export default { getUserProfile, addCart, getCartAll, updateProfile, getTrx };
