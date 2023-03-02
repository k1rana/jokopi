import { query } from "../configs/postgre";

const getProducts = (q) => {
  return new Promise((resolve, reject) => {
    let sql = "select * from products ORDER BY id ASC";

    query(sql, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
};

const getProductDetail = (p) => {
  return new Promise((resolve, reject) => {
    const sql = "select * from products WHERE id = $1";
    const values = [p.productId];
    query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
};

const insertProducts = (data) => {
  return new Promise((resolve, reject) => {
    const sql =
      "insert into products (name, price) values ($1, $2) RETURNING *";
    // parameterized query
    const values = [data.name, data.price];
    query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export default {
  getProducts,
  insertProducts,
  getProductDetail,
};