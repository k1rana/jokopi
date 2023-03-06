import db from "../helpers/postgre.js";

function index(req) {
  return new Promise((resolve, reject) => {
    const sort = req.query.sort == "desc" ? "DESC" : "ASC"; // sort with query ?sort=
    let sortColumn;
    switch (req.query.orderBy || null) {

      default:
        sortColumn = "id";
        break;

    }
    const sql = `SELECT 
    u.id, 
    u.email, 
    u.password, 
    p.display_name,
    p.first_name,
    p.last_name,
    p.phone_number,
    p.address,
    p.birthdate,
    p.img AS img_url FROM users u 
    LEFT JOIN user_profile p ON p.user_id = u.id
    ORDER BY ${sortColumn} ${sort}`;

    db.query(sql, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

//
const store = (req) => {
  return new Promise((resolve, reject) => {
    const sql =
      `WITH inserted_user AS (
        INSERT INTO users (email, password) 
        VALUES ($1, $2)
        RETURNING id, email, password
      )
      INSERT INTO user_profile (user_id) 
      SELECT id
      FROM inserted_user AS i;
      SELECT *
      FROM user_profile
      WHERE user_id = (SELECT id FROM inserted_user);
      `;

    const data = req.body;
    const values = [data.email, data.password];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

function show(req) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
    u.id, 
    u.email, 
    u.password, 
    p.display_name,
    p.first_name,
    p.last_name,
    p.phone_number,
    p.address,
    p.birthdate,
    p.img AS img_url FROM users u 
    LEFT JOIN user_profile p ON p.user_id = u.id
    WHERE u.id = $1`;
    const values = [req.params.userId];
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
    const sql = `
    UPDATE users
    LEFT JOIN
    user_profile ON users.id = user_profile.user_id 
    SET 
salary = salary + salary * 0.015
WHERE
merits.percentage IS NULL`;
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
