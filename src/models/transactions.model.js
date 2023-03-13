import db from '../helpers/postgre.js';

function index(req) {
  return new Promise((resolve, reject) => {
    const limit = `LIMIT ${!isNaN(req.query.limit) ? req.query.limit : 10}`;
    const sql = `SELECT t.id, u.email as receiver_email, up.display_name as receiver_name, ps.code as payment_code, ps.fee as payment_fee, d.name as delivery, d.fee as delivery_fee
    FROM transactions t
    JOIN users u ON t.user_id = u.id
    JOIN user_profile up ON t.user_id = up.user_id
    JOIN payments ps ON t.payment_code = ps.code
    JOIN deliveries d ON t.delivery_id = d.id
    ${limit}`;

    db.query(sql, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

function list(id_transaction) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT ROW_NUMBER() OVER() AS number, p.name as product_name, ps.name as size
    FROM transaction_product_size tps
    JOIN transactions t ON tps.transaction_id = t.id
    JOIN products p ON tps.product_id = p.id
    JOIN product_size ps ON tps.size_id = ps.id
    WHERE tps.transaction_id = $1`;

    db.query(sql, [id_transaction], (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

const store = (req) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO history 
      (user_id, product_id, quantity, discount, promo_id, payment_method, price, total_price) 
      VALUES 
      ($1, $2, $3, $4, $5, $6, (SELECT price FROM products WHERE id = $2), $3 * ((SELECT price FROM products WHERE id = $2) - ((SELECT price FROM products WHERE id = $2) * $4/100)))
      RETURNING *`;

    const data = req.body;
    const values = [
      data.user_id,
      data.product_id,
      data.quantity,
      data.discount,
      data.promo_id,
      data.payment_method,
    ];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

function show(req) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
    h.*,
    p.name AS payment_name, 
    p.fee AS payment_fee
    FROM history h 
    LEFT JOIN payment_method p ON h.payment_method = p.code
    WHERE h.id = $1`;
    const values = [req.params.historyId];
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

function update(req) {
  return new Promise((resolve, reject) => {
    const { historyId } = req.params;
    const sql = `UPDATE history 
    SET 
       user_id = $1, 
       product_id = $2, 
       quantity = $3, 
       discount = $4, 
       promo_id = $5, 
       payment_method = $6, 
       price = (SELECT price FROM products WHERE id = $2), 
       total_price = $3 * ((SELECT price FROM products WHERE id = $2) - ((SELECT price FROM products WHERE id = $2) * $4/100))
    WHERE 
       id = $7 
    RETURNING *`;
    const data = req.body;
    const values = [
      data.user_id,
      data.product_id,
      data.quantity,
      data.discount,
      data.promo_id,
      data.payment_method,
      historyId,
    ];
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

function destroy(req) {
  return new Promise((resolve, reject) => {
    const { historyId } = req.params;
    const sql = `DELETE FROM history WHERE id = $1 RETURNING *`;
    const values = [historyId];
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

export default {
  index,
  show,
  store,
  update,
  destroy,
  list,
};
