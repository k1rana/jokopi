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
    const limit = `LIMIT ${!isNaN(req.query.limit) ? req.query.limit : 10}`;
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
    ORDER BY ${sortColumn} ${sort}
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

//
const store = (req) => {
  return new Promise((resolve, reject) => {
    const sql = `WITH inserted_user AS (
        INSERT INTO users (email, password) 
        VALUES ($1, $2)
        RETURNING id, email, password
      )
      INSERT INTO user_profile (user_id) 
      SELECT id
      FROM inserted_user AS i RETURNING id, user_id`;

    const data = req.body;
    const values = [data.email, data.password];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      const idUser = result.rows[0].user_id;
      db.query(
        `SELECT u.id, 
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
      WHERE u.id = '${idUser}'`,
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
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

function updateProfile(req) {
  return new Promise((resolve, reject) => {
    const {
      display_name,
      first_name,
      last_name,
      phone_number,
      address,
      birthdate,
    } = req.body;
    const { userId } = req.params;
    const sql = `
    UPDATE user_profile SET 
    display_name = $1,
    first_name = $2, 
    last_name = $3, 
    phone_number = $4, 
    address = $5, 
    birthdate = $6
    WHERE id = $7 RETURNING *`;
    const values = [
      display_name,
      first_name,
      last_name,
      phone_number,
      address,
      birthdate,
      userId,
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
    const { userId } = req.params;
    const sql = `DELETE FROM users WHERE id IN (SELECT users.id FROM users LEFT JOIN user_profile ON users.id = user_profile.user_id WHERE users.id = $1) RETURNING *`;
    const values = [userId];
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
  updateProfile,
  destroy,
};
