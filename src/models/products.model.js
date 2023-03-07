import db from "../helpers/postgre.js";

function index(req) {
  return new Promise((resolve, reject) => {
    const sort = req.query.sort == "desc" ? "DESC" : "ASC"; // sort with query ?sort=
    let sortColumn;
    switch (req.query.orderBy || null) {
      case "name":
        sortColumn = "name";
        break;

      case "category":
        sortColumn = "category_id";
        break;

      default:
        sortColumn = "id";
        break;
    }
    let searchSql = '%';
    if (req.query.searchByName !== undefined) {
      searchSql = '%'+req.query.searchByName+'%';
    }
    const limit = `LIMIT ${!isNaN(req.query.limit) ? req.query.limit : 10}`;
    const sql = `SELECT 
    p.id, 
    p.name, 
    p.price, 
    p.category_id, 
    c.name AS category_name FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.name ILIKE $1
    ORDER BY ${sortColumn} ${sort}
    ${limit}`;

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
    const sql =
      "INSERT INTO products (name, price, category_id) VALUES ($1, $2, $3) RETURNING *";

    const data = req.body;
    const values = [data.name, data.price, data.category_id || 0];
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
    p.price, 
    p.category_id, 
    c.name AS category_name FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = $1`;
    const values = [req.params.productId];
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
    const { productId } = req.params;
    const sql = `UPDATE products SET name = $1, price = $2, category_id = $3 WHERE id = $4 RETURNING *`;
    const values = [name, price, category_id, productId];
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
    const { productId } = req.params;
    const sql = `DELETE FROM products WHERE id = $1 RETURNING *`;
    const values = [productId];
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
  destroy
};
