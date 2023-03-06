import db from "../helpers/postgre.js";

function index(req) {
  return new Promise((resolve, reject) => {
    const sort = req.query.sort == "desc" ? "DESC" : "ASC"; // sort with query ?sort=
    let sortColumn;
    switch (req.query.orderBy || null) {
      case "name":
        sortColumn = "name";
        break;

      case "start_date":
        sortColumn = "start_date";
        break;

      case "end_date":
        sortColumn = "end_date";
        break;

      case "discount":
        sortColumn = "discount";
        break;

      default:
        sortColumn = "id";
        break;
    }

    let searchSql = "%";
    if (req.query.searchByName !== undefined) {
      searchSql = "%" + req.query.searchByName + "%";
    }

    let available = "";
    if (req.query.available === "true") {
      available = " AND start_date <= NOW() AND end_date >= NOW()";
    }

    const sql = `SELECT 
    p.id, 
    p.name,
    p.desc,
    p.discount, 
    p.start_date,
    p.end_date,
    p.coupon_code,
    p.size, 
    p.delivery_methods, 
    p.product_id FROM promo p 
    LEFT JOIN products c ON p.product_id = c.id
    WHERE p.name ILIKE $1
    ${available}
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
    const sql = `INSERT INTO promo 
      ("name", "desc", discount, start_date, end_date, coupon_code, size, delivery_methods, product_id) 
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`;

    const data = req.body;
    const values = [
      data.name,
      data.desc,
      data.discount,
      data.start_date,
      data.end_date,
      data.coupon_code,
      data.size,
      data.delivery_methods,
      data.product_id,
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
    p.id, 
    p.name,
    p.desc,
    p.discount, 
    p.start_date,
    p.end_date,
    p.coupon_code,
    p.size, 
    p.delivery_methods, 
    p.product_id FROM promo p 
    LEFT JOIN products c ON p.product_id = c.id
    WHERE p.id = $1`;
    const values = [req.params.promoId];
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
    const data = req.body;
    const { promoId } = req.params;
    const sql = `
    UPDATE promo SET 
    "name" = $1, 
    "desc" = $2, 
    discount = $3, 
    start_date = $4, 
    end_date = $5, 
    coupon_code = $6, 
    size = $7, 
    delivery_methods = $8, 
    product_id = $9 
    WHERE id = $10
    RETURNING *`;
    const values = [
      data.name,
      data.desc,
      data.discount,
      data.start_date,
      data.end_date,
      data.coupon_code,
      data.size,
      data.delivery_methods,
      data.product_id,
      promoId
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
    const { promoId } = req.params;
    const sql = `DELETE FROM promo WHERE id = $1 RETURNING *`;
    const values = [promoId];
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
