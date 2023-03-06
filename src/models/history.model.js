import db from "../helpers/postgre.js";

function index(req) {
  return new Promise((resolve, reject) => {
    const sort = req.query.sort == "desc" ? "DESC" : "ASC"; // sort with query ?sort=
    let sortColumn;
    switch (req.query.orderBy || null) {
      case "user_id":
        sortColumn = "h.user_id";
      break;

      case "price":
        sortColumn = "h.price";
      break;

      case "transaction_time":
        sortColumn = "h.transaction_time";
      break;

      case "product_id":
        sortColumn = "h.product_id";
      break;

      case "discount":
        sortColumn = "h.discount";
      break;

      case "total_price":
        sortColumn = "h.total_price";
      break;

      default:
        sortColumn = "h.id";
        break;
    }
    let searchSql = "%";
    if (req.query.searchByName !== undefined) {
      searchSql = "%" + req.query.searchByName + "%";
    }

    const getbyUserSql = (!isNaN(req.query.getByUserId) ? 'AND user_id = ' + req.query.getByUserId : "");

    const sql = `SELECT 
    h.*,
    p.name AS payment_name, 
    p.fee AS payment_fee
    FROM history h 
    LEFT JOIN payment_method p ON h.payment_method = p.code
    WHERE p.name ILIKE $1
    ${getbyUserSql}
    ORDER BY ${sortColumn} ${sort}`;

    const values = [searchSql];
    db.query(sql, values, (error, result) => {
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
    const values = [data.user_id, data.product_id, data.quantity, data.discount, data.promo_id, data.payment_method];
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
    const { name, price, category_id } = req.body;
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
    const values = [data.user_id, data.product_id, data.quantity, data.discount, data.promo_id, data.payment_method];
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
};
